import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
from api.models import (
    Student, AtlasAction, Course, Enrollment,
    Advisor, AdvisorSlot, DegreeRequirement, StudentCourseHistory,
)
from api.sf_client import get_sf_connection

class Command(BaseCommand):
    help = 'Generates synthetic student data and seeds it into Salesforce'

    def handle(self, *args, **options):
        fake = Faker()
        sf = get_sf_connection()

        if not sf:
            self.stderr.write("Could not connect to Salesforce. Check your .env file.")
            return

        self.stdout.write("Connected to Salesforce. Starting data generation...")

        # Clear local data for fresh start
        self.stdout.write("Clearing local database...")
        AtlasAction.objects.all().delete()
        Enrollment.objects.all().delete()
        AdvisorSlot.objects.all().delete()
        StudentCourseHistory.objects.all().delete()
        Student.objects.all().delete()
        Course.objects.all().delete()
        Advisor.objects.all().delete()
        DegreeRequirement.objects.all().delete()

        # ═══════════════════════════════════════════════════
        # 1. Generate Students (Contacts)
        # ═══════════════════════════════════════════════════
        self.stdout.write("Generating Students...")
        students = []
        majors = ["Computer Science", "Biology", "Economics", "Psychology", "Mathematics", "Business", "Political Science"]
        
        # Ensure 'Jordan123' exists for demo
        demo_student_data = {
            'FirstName': 'Jordan',
            'LastName': 'Student',
            'Email': 'jordan123@uw.edu',
            'Title': 'Student',
            'Department': 'Computer Science',
            'Description': 'GPA: 3.5 | Year: Junior'
        }
        try:
            res = sf.Contact.create(demo_student_data)
            sf_id = res['id']
        except Exception as e:
            # Handle Salesforce duplicate — reuse existing record
            self.stderr.write(f"SF duplicate for Jordan, reusing existing: {e}")
            existing = sf.query("SELECT Id FROM Contact WHERE Email = 'jordan123@uw.edu' LIMIT 1")
            if existing['totalSize'] > 0:
                sf_id = existing['records'][0]['Id']
            else:
                sf_id = 'sf_demo_fallback'
        demo_student, _ = Student.objects.get_or_create(
            netid='jordan123',
            defaults={
                'first_name': 'Jordan',
                'last_name': 'Student',
                'email': 'jordan123@uw.edu',
                'major': 'Computer Science',
                'gpa': 3.5,
                'sf_id': sf_id,
            }
        )
        students.append(demo_student.sf_id)
        self.stdout.write("Created/Found Demo Student: Jordan Student (jordan123)")

        for _ in range(15): # Generate 15 more students
            first_name = fake.first_name()
            last_name = fake.last_name()
            netid = f"{first_name[0].lower()}{last_name.lower()}{random.randint(100, 999)}"
            email = f"{netid}@uw.edu"
            
            student_data = {
                'FirstName': first_name,
                'LastName': last_name,
                'Email': email,
                'Title': 'Student',
                'Department': random.choice(majors),
                'Description': f"GPA: {round(random.uniform(2.5, 4.0), 2)} | Year: {random.choice(['Freshman', 'Sophomore', 'Junior', 'Senior'])}"
            }
            
            try:
                res = sf.Contact.create(student_data)
                students.append(res['id'])
                self.stdout.write(f"Created Student: {first_name} {last_name} ({netid})")
            except Exception as e:
                self.stderr.write(f"Error creating student: {e}")

        # ═══════════════════════════════════════════════════
        # 2. Generate Interaction Logs (Cases)
        # ═══════════════════════════════════════════════════
        if students:
            self.stdout.write("Generating Interaction Logs...")
            subjects = [
                "Financial Aid Letter Clarification",
                "Registration Hold - Missing Documents",
                "Change of Major Inquiry",
                "Advisor Appointment Request",
                "Mental Health Support Connection",
                "Job Offer Evaluation Help"
            ]
            
            for _ in range(30): # Generate 30 cases
                student_id = random.choice(students)
                case_data = {
                    'ContactId': student_id,
                    'Subject': random.choice(subjects),
                    'Status': 'New',
                    'Origin': 'Web',
                    'Description': fake.paragraph(nb_sentences=3)
                }
                
                try:
                    sf.Case.create(case_data)
                    self.stdout.write("Created Interaction Log (Case)")
                except Exception as e:
                    self.stderr.write(f"Error creating case: {e}")

        # ═══════════════════════════════════════════════════
        # 3. Generate Courses
        # ═══════════════════════════════════════════════════
        self.stdout.write("Generating Courses...")
        courses_data = [
            {"code": "CSE 142", "title": "Computer Programming I", "department": "Computer Science", "credits": 4, "capacity": 250, "enrolled_count": 237, "schedule": "MWF 10:30-11:20", "location": "Kane Hall 130"},
            {"code": "CSE 143", "title": "Computer Programming II", "department": "Computer Science", "credits": 4, "capacity": 200, "enrolled_count": 198, "schedule": "MWF 11:30-12:20", "location": "Kane Hall 130"},
            {"code": "CSE 332", "title": "Data Structures & Parallelism", "department": "Computer Science", "credits": 4, "capacity": 150, "enrolled_count": 145, "schedule": "TTh 10:00-11:20", "location": "CSE2 G10"},
            {"code": "CSE 351", "title": "Hardware/Software Interface", "department": "Computer Science", "credits": 4, "capacity": 150, "enrolled_count": 150, "schedule": "MWF 1:30-2:20", "location": "CSE2 G10"},
            {"code": "MATH 208", "title": "Matrix Algebra with Applications", "department": "Mathematics", "credits": 3, "capacity": 35, "enrolled_count": 30, "schedule": "MWF 9:30-10:20", "location": "Savery 264"},
            {"code": "MATH 307", "title": "Introduction to Differential Equations", "department": "Mathematics", "credits": 3, "capacity": 35, "enrolled_count": 35, "schedule": "TTh 1:30-2:50", "location": "Smith 120"},
            {"code": "PSYCH 101", "title": "Introduction to Psychology", "department": "Psychology", "credits": 5, "capacity": 500, "enrolled_count": 421, "schedule": "MWF 12:30-1:20", "location": "Kane Hall 120"},
            {"code": "ECON 200", "title": "Introduction to Microeconomics", "department": "Economics", "credits": 5, "capacity": 400, "enrolled_count": 356, "schedule": "TTh 9:00-10:20", "location": "Gowen 201"},
            {"code": "INFO 340", "title": "Client-Side Development", "department": "Informatics", "credits": 4, "capacity": 45, "enrolled_count": 38, "schedule": "TTh 11:30-12:50", "location": "MGH 271"},
            {"code": "STAT 311", "title": "Elements of Statistical Methods", "department": "Statistics", "credits": 5, "capacity": 60, "enrolled_count": 52, "schedule": "MWF 2:30-3:20", "location": "Savery 130"},
            {"code": "ENGL 182", "title": "Craft of Verse", "department": "English", "credits": 3, "capacity": 25, "enrolled_count": 18, "schedule": "TTh 3:00-4:20", "location": "Padelford C8"},
            {"code": "BIOL 220", "title": "Introductory Biology II", "department": "Biology", "credits": 5, "capacity": 300, "enrolled_count": 267, "schedule": "MWF 8:30-9:20", "location": "Kane Hall 120"},
        ]
        for cd in courses_data:
            Course.objects.create(**cd, term="Spring 2026")
            self.stdout.write(f"  Created: {cd['code']} — {cd['title']}")

        # ═══════════════════════════════════════════════════
        # 4. Generate Advisors + Appointment Slots
        # ═══════════════════════════════════════════════════
        self.stdout.write("Generating Advisors and Slots...")
        advisors_data = [
            {"name": "Dr. Sarah Patel", "department": "Computer Science", "email": "spatel@uw.edu", "office": "Paul Allen Center 542"},
            {"name": "Dr. Michael Torres", "department": "Computer Science", "email": "mtorres@uw.edu", "office": "Paul Allen Center 310"},
            {"name": "Dr. Lisa Chen", "department": "Mathematics", "email": "lchen@uw.edu", "office": "Padelford C-301"},
            {"name": "Dr. James Walker", "department": "Economics", "email": "jwalker@uw.edu", "office": "Savery 305"},
            {"name": "Dr. Maya Johnson", "department": "Psychology", "email": "mjohnson@uw.edu", "office": "Guthrie Hall 233"},
        ]
        now = timezone.now()
        for ad in advisors_data:
            advisor = Advisor.objects.create(**ad)
            # Create 6 upcoming slots per advisor over the next 5 days
            for day_offset in range(1, 6):
                for hour in [10, 14]:  # 10 AM and 2 PM
                    slot_dt = (now + timedelta(days=day_offset)).replace(hour=hour, minute=0, second=0, microsecond=0)
                    AdvisorSlot.objects.create(advisor=advisor, datetime=slot_dt)
            self.stdout.write(f"  Created Advisor: {ad['name']} with 10 slots")

        # ═══════════════════════════════════════════════════
        # 5. Degree Requirements (Computer Science)
        # ═══════════════════════════════════════════════════
        self.stdout.write("Generating Degree Requirements...")
        cs_reqs = [
            {"major": "Computer Science", "requirement_name": "Core CS Courses", "credits_required": 52},
            {"major": "Computer Science", "requirement_name": "Math & Science Foundation", "credits_required": 38},
            {"major": "Computer Science", "requirement_name": "General Education & Electives", "credits_required": 60},
            {"major": "Computer Science", "requirement_name": "Writing (C & W courses)", "credits_required": 15},
            {"major": "Computer Science", "requirement_name": "Diversity Requirement", "credits_required": 5},
            {"major": "Computer Science", "requirement_name": "Free Electives", "credits_required": 10},
        ]
        for req in cs_reqs:
            DegreeRequirement.objects.create(**req)
            self.stdout.write(f"  Req: {req['requirement_name']} ({req['credits_required']} cr)")

        # ═══════════════════════════════════════════════════
        # 6. Jordan's Course History (transcript)
        # ═══════════════════════════════════════════════════
        if demo_student:
            self.stdout.write("Generating Jordan's course history...")
            transcript = [
                # Freshman Year
                {"course_code": "CSE 142", "course_title": "Computer Programming I", "credits": 4, "grade": "A", "term": "Fall 2023"},
                {"course_code": "MATH 124", "course_title": "Calculus I", "credits": 5, "grade": "B+", "term": "Fall 2023"},
                {"course_code": "ENGL 111", "course_title": "Composition", "credits": 5, "grade": "A-", "term": "Fall 2023"},
                {"course_code": "CSE 143", "course_title": "Computer Programming II", "credits": 4, "grade": "A-", "term": "Winter 2024"},
                {"course_code": "MATH 125", "course_title": "Calculus II", "credits": 5, "grade": "B", "term": "Winter 2024"},
                {"course_code": "PSYCH 101", "course_title": "Intro to Psychology", "credits": 5, "grade": "A", "term": "Winter 2024"},
                {"course_code": "PHYS 121", "course_title": "Mechanics", "credits": 5, "grade": "B+", "term": "Spring 2024"},
                {"course_code": "CSE 163", "course_title": "Intermediate Data Programming", "credits": 4, "grade": "A", "term": "Spring 2024"},
                # Sophomore Year
                {"course_code": "CSE 311", "course_title": "Foundations of Computing I", "credits": 4, "grade": "B+", "term": "Fall 2024"},
                {"course_code": "MATH 126", "course_title": "Calculus III", "credits": 5, "grade": "B", "term": "Fall 2024"},
                {"course_code": "STAT 311", "course_title": "Elements of Stat Methods", "credits": 5, "grade": "A-", "term": "Fall 2024"},
                {"course_code": "CSE 312", "course_title": "Foundations of Computing II", "credits": 4, "grade": "B+", "term": "Winter 2025"},
                {"course_code": "CSE 332", "course_title": "Data Structures & Parallelism", "credits": 4, "grade": "A-", "term": "Winter 2025"},
                {"course_code": "ECON 200", "course_title": "Intro to Microeconomics", "credits": 5, "grade": "B+", "term": "Winter 2025"},
                {"course_code": "CSE 331", "course_title": "Software Design & Implementation", "credits": 4, "grade": "A", "term": "Spring 2025"},
                {"course_code": "INFO 340", "course_title": "Client-Side Development", "credits": 4, "grade": "A", "term": "Spring 2025"},
                # Junior Year (current — Fall 2025 complete)
                {"course_code": "CSE 351", "course_title": "HW/SW Interface", "credits": 4, "grade": "B", "term": "Fall 2025"},
                {"course_code": "MATH 208", "course_title": "Matrix Algebra", "credits": 3, "grade": "C-", "term": "Fall 2025"},
                {"course_code": "ENGL 182", "course_title": "Craft of Verse", "credits": 3, "grade": "A-", "term": "Fall 2025"},
            ]
            for entry in transcript:
                StudentCourseHistory.objects.create(student=demo_student, **entry)
            total_cr = sum(e['credits'] for e in transcript)
            self.stdout.write(f"  Added {len(transcript)} courses ({total_cr} credits) to Jordan's transcript")

        self.stdout.write(self.style.SUCCESS('Successfully seeded synthetic data into Salesforce!'))
