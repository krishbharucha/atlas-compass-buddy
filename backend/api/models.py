from django.db import models

class Student(models.Model):
    netid = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    major = models.CharField(max_length=200, blank=True)
    gpa = models.FloatField(null=True, blank=True)
    sf_id = models.CharField(max_length=18, unique=True, null=True, blank=True) # Salesforce Contact ID
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.netid})"

class AtlasAction(models.Model):
    STATUS_CHOICES = [
        ('Complete', 'Complete'),
        ('In Progress', 'In Progress'),
        ('Awaiting', 'Awaiting'),
        ('Ready', 'Ready'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='actions')
    sf_id = models.CharField(max_length=18, null=True, blank=True) # Salesforce Case ID
    type = models.CharField(max_length=20) # info, warning, action
    title = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Awaiting')
    agentforce_note = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.student.netid}"


# ═══════════════════════════════════════════════════
# Phase 1: Tool Expansion Models
# ═══════════════════════════════════════════════════

class Course(models.Model):
    code = models.CharField(max_length=20, unique=True)          # e.g. "CSE 142"
    title = models.CharField(max_length=200)                     # e.g. "Intro to Programming"
    department = models.CharField(max_length=100)
    credits = models.IntegerField(default=3)
    capacity = models.IntegerField(default=30)
    enrolled_count = models.IntegerField(default=0)
    schedule = models.CharField(max_length=200, blank=True)      # e.g. "MWF 10:30-11:20"
    term = models.CharField(max_length=20, default="Spring 2026")
    location = models.CharField(max_length=100, blank=True)      # e.g. "Kane Hall 120"

    def __str__(self):
        return f"{self.code} — {self.title}"

    @property
    def seats_available(self):
        return self.capacity - self.enrolled_count

    @property
    def is_full(self):
        return self.enrolled_count >= self.capacity


class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('enrolled', 'Enrolled'),
        ('waitlisted', 'Waitlisted'),
        ('dropped', 'Dropped'),
    ]
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='enrolled')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.netid} → {self.course.code} ({self.status})"


class Advisor(models.Model):
    name = models.CharField(max_length=200)
    department = models.CharField(max_length=100)
    email = models.EmailField()
    office = models.CharField(max_length=100, blank=True)        # e.g. "Mary Gates 340"

    def __str__(self):
        return f"{self.name} ({self.department})"


class AdvisorSlot(models.Model):
    advisor = models.ForeignKey(Advisor, on_delete=models.CASCADE, related_name='slots')
    datetime = models.DateTimeField()
    is_booked = models.BooleanField(default=False)
    booked_by = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True, blank=True, related_name='advisor_appointments')

    def __str__(self):
        status = "BOOKED" if self.is_booked else "open"
        return f"{self.advisor.name} | {self.datetime:%b %d %I:%M %p} [{status}]"


class DegreeRequirement(models.Model):
    major = models.CharField(max_length=200)                     # e.g. "Computer Science"
    requirement_name = models.CharField(max_length=200)          # e.g. "Core CS Courses"
    credits_required = models.IntegerField()

    def __str__(self):
        return f"{self.major}: {self.requirement_name} ({self.credits_required} cr)"


class StudentCourseHistory(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='course_history')
    course_code = models.CharField(max_length=20)
    course_title = models.CharField(max_length=200, blank=True)
    credits = models.IntegerField(default=3)
    grade = models.CharField(max_length=5)                       # e.g. "A-", "B+", "C"
    term = models.CharField(max_length=20)                       # e.g. "Fall 2025"

    def __str__(self):
        return f"{self.student.netid}: {self.course_code} — {self.grade}"


class KnowledgeDocument(models.Model):
    """Tracks documents ingested into the RAG knowledge base (ChromaDB)."""
    filename = models.CharField(max_length=300, unique=True)
    title = models.CharField(max_length=300, blank=True)
    source_path = models.CharField(max_length=500)
    chunk_count = models.IntegerField(default=0)
    ingested_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title or self.filename} ({self.chunk_count} chunks)"
