from rest_framework import serializers
from .models import (
    Student, AtlasAction, Course, Enrollment,
    Advisor, AdvisorSlot, DegreeRequirement, StudentCourseHistory,
    KnowledgeDocument,
)

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

class AtlasActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AtlasAction
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    seats_available = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()

    class Meta:
        model = Course
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class AdvisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advisor
        fields = '__all__'

class AdvisorSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdvisorSlot
        fields = '__all__'

class DegreeRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = DegreeRequirement
        fields = '__all__'

class StudentCourseHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentCourseHistory
        fields = '__all__'

class KnowledgeDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeDocument
        fields = '__all__'
