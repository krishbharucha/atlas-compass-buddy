from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Student, AtlasAction
from .serializers import StudentSerializer, AtlasActionSerializer
from .sf_client import get_sf_connection

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    @action(detail=False, methods=['post'])
    def sync_sf(self, request):
        """
        Syncs student data from Salesforce Contacts.
        """
        sf = get_sf_connection()
        if not sf:
            return Response({"error": "Salesforce connection failed"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            # Query contacts that look like students
            contacts = sf.query("SELECT Id, FirstName, LastName, Email, Department, Description FROM Contact WHERE Title = 'Student'")
            records = contacts.get('records', [])
            
            synced_count = 0
            for record in records:
                # Extract NetID from Email (demo logic) or Description if stored there
                email = record.get('Email', '')
                netid = email.split('@')[0] if email else f"user_{record['Id'][-4:]}"
                
                student, created = Student.objects.update_or_create(
                    sf_id=record['Id'],
                    defaults={
                        'netid': netid,
                        'first_name': record.get('FirstName', ''),
                        'last_name': record.get('LastName', ''),
                        'email': email,
                        'major': record.get('Department', ''),
                        'gpa': 3.5 # Placeholder or parse from Description if available
                    }
                )
                synced_count += 1
            
            return Response({"status": f"Successfully synced {synced_count} students"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AtlasActionViewSet(viewsets.ModelViewSet):
    queryset = AtlasAction.objects.all()
    serializer_class = AtlasActionSerializer

    @action(detail=False, methods=['post'])
    def process_chat(self, request):
        """
        Processes a chat message and generates actions, syncing with Salesforce.
        """
        user_message = request.data.get('message', '').lower()
        netid = request.data.get('netid', 'jordan123') # Default for demo
        
        try:
            student = Student.objects.get(netid=netid)
        except Student.DoesNotExist:
            print("Student not found locally. Ephemeral DB might have reset. Auto-seeding...")
            from django.core.management import call_command
            try:
                call_command('seed_sf_data')
                student = Student.objects.get(netid=netid)
            except Exception as e:
                return Response({"error": f"Student not found and auto-sync failed: {str(e)}. Please check your Salesforce credentials in Render."}, status=status.HTTP_404_NOT_FOUND)

        # Dynamic Agent Execution Loop (Gemini)
        from .agent import execute_agent_chat
        
        try:
            agent_text, new_actions, ui_triggers = execute_agent_chat(user_message, student)
            
            response_data = {
                "text": agent_text,
                "actions": [AtlasActionSerializer(action).data for action in new_actions],
                "ui_triggers": ui_triggers,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Agent execution failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
