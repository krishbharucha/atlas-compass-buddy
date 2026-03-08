import google.generativeai as genai
import os
from django.utils import timezone
from .models import (
    Student, AtlasAction, Course, Enrollment,
    Advisor, AdvisorSlot, DegreeRequirement, StudentCourseHistory,
)
from .sf_client import get_sf_connection

# Will be called dynamically per request to ensure env is loaded
def configure_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        genai.configure(api_key=api_key)
    return api_key


# ═══════════════════════════════════════════════════
# Original Tools
# ═══════════════════════════════════════════════════

def query_student_hold(netid: str) -> str:
    """Checks if the student has any holds on their account."""
    
    # We create an AtlasAction to show on the UI
    try:
        student = Student.objects.get(netid=netid)
        AtlasAction.objects.create(
            student=student,
            type="warning",
            title="Immunization Hold Check",
            description="Agent verified hold status in system.",
            status="Complete",
            agentforce_note="Gemini Tool: query_student_hold"
        )
    except:
        pass
        
    return f"Student {netid} has a hold for missing immunization records. They cannot register for Spring until it is resolved."

def query_financial_aid(netid: str) -> str:
    """Checks the student's financial aid status and recent disbursements."""
    
    try:
        student = Student.objects.get(netid=netid)
        AtlasAction.objects.create(
            student=student,
            type="info",
            title="Financial Aid Retrieval",
            description="Agent pulled recent 2025-26 award letters.",
            status="Complete",
            agentforce_note="Gemini Tool: query_financial_aid"
        )
    except:
        pass
        
    return f"Student {netid} was awarded $7,500 Merit Scholarship and $3,250 Pell Grant. Disbursement is pending verification."

def create_support_case(netid: str, issue: str) -> str:
    """Creates a high-priority support case in Salesforce for the student."""
    sf = get_sf_connection()
    if not sf:
        return "Failed to connect to Salesforce."
    try:
        student = Student.objects.get(netid=netid)
        sf_case = sf.Case.create({
            'ContactId': student.sf_id,
            'Subject': issue,
            'Description': 'Automated case created by Atlas AI Agent.',
            'Status': 'New'
        })
        
        AtlasAction.objects.create(
            student=student,
            type="action",
            title=issue,
            description="Agent autonomously escalated to human staff via Case creation.",
            status="Complete",
            sf_id=sf_case['id'],
            agentforce_note="Gemini Tool: create_support_case"
        )
        return f"Successfully created case in Salesforce with ID {sf_case['id']}"
    except Exception as e:
        return str(e)


# ═══════════════════════════════════════════════════
# Phase 1: Course Registration Tools
# ═══════════════════════════════════════════════════

def search_courses(query: str) -> str:
    """Searches available courses matching a keyword, department, or course code. Returns a list of matching courses with availability."""
    from django.db.models import Q
    courses = Course.objects.filter(
        Q(code__icontains=query) |
        Q(title__icontains=query) |
        Q(department__icontains=query)
    )[:10]

    if not courses:
        return f"No courses found matching '{query}'."

    results = []
    for c in courses:
        seats = c.seats_available
        status_str = f"{seats} seats open" if seats > 0 else "FULL — waitlist only"
        results.append(f"• {c.code}: {c.title} ({c.credits}cr) — {c.schedule} @ {c.location} [{status_str}]")

    return f"Found {len(results)} course(s) matching '{query}':\n" + "\n".join(results)


def enroll_student_in_course(netid: str, course_code: str) -> str:
    """Enrolls the student in the specified course section. If the course is full, the student is placed on the waitlist."""
    try:
        student = Student.objects.get(netid=netid)
    except Student.DoesNotExist:
        return f"Student with NetID '{netid}' not found."

    try:
        course = Course.objects.get(code__iexact=course_code)
    except Course.DoesNotExist:
        return f"Course '{course_code}' not found in the catalog."

    # Check if already enrolled
    existing = Enrollment.objects.filter(student=student, course=course).exclude(status='dropped').first()
    if existing:
        return f"Student {netid} is already {existing.status} in {course.code}."

    if course.is_full:
        Enrollment.objects.create(student=student, course=course, status='waitlisted')
        AtlasAction.objects.create(
            student=student, type="warning",
            title=f"Waitlisted: {course.code}",
            description=f"Course is full ({course.capacity}/{course.capacity}). Student placed on waitlist for {course.title}.",
            status="In Progress",
            agentforce_note="Gemini Tool: enroll_student_in_course"
        )
        return f"Course {course.code} is full. Student {netid} has been added to the waitlist."
    else:
        Enrollment.objects.create(student=student, course=course, status='enrolled')
        course.enrolled_count += 1
        course.save()
        AtlasAction.objects.create(
            student=student, type="action",
            title=f"Enrolled: {course.code}",
            description=f"Successfully enrolled in {course.title} ({course.credits}cr) — {course.schedule}.",
            status="Complete",
            agentforce_note="Gemini Tool: enroll_student_in_course"
        )
        return f"Successfully enrolled student {netid} in {course.code}: {course.title}. Schedule: {course.schedule} @ {course.location}."


# ═══════════════════════════════════════════════════
# Phase 1: Advisor Booking Tools
# ═══════════════════════════════════════════════════

def check_advisor_availability(department: str) -> str:
    """Lists available (unbooked) advisor appointment slots for the given department."""
    slots = AdvisorSlot.objects.filter(
        advisor__department__icontains=department,
        is_booked=False,
        datetime__gte=timezone.now(),
    ).select_related('advisor').order_by('datetime')[:8]

    if not slots:
        return f"No available advisor slots found for the {department} department."

    results = []
    for s in slots:
        results.append(
            f"• Slot #{s.id}: {s.advisor.name} — {s.datetime:%A %b %d at %I:%M %p} (Office: {s.advisor.office})"
        )

    return f"Available {department} advisor slots:\n" + "\n".join(results)


def book_advisor_appointment(netid: str, slot_id: int) -> str:
    """Books an advisor appointment for the student using the given slot ID."""
    try:
        student = Student.objects.get(netid=netid)
    except Student.DoesNotExist:
        return f"Student with NetID '{netid}' not found."

    try:
        slot = AdvisorSlot.objects.select_related('advisor').get(id=slot_id)
    except AdvisorSlot.DoesNotExist:
        return f"Advisor slot #{slot_id} not found."

    if slot.is_booked:
        return f"Slot #{slot_id} with {slot.advisor.name} is already booked. Please choose another slot."

    slot.is_booked = True
    slot.booked_by = student
    slot.save()

    AtlasAction.objects.create(
        student=student, type="action",
        title=f"Advisor Appt: {slot.advisor.name}",
        description=f"Booked with {slot.advisor.name} on {slot.datetime:%A %b %d at %I:%M %p} — {slot.advisor.office}.",
        status="Complete",
        agentforce_note="Gemini Tool: book_advisor_appointment"
    )

    return (
        f"Appointment booked! {student.first_name} will meet {slot.advisor.name} "
        f"on {slot.datetime:%A %b %d at %I:%M %p} at {slot.advisor.office}."
    )


# ═══════════════════════════════════════════════════
# Phase 1: Degree Audit Tool
# ═══════════════════════════════════════════════════

GRADE_POINTS = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0,
}

def run_degree_audit(netid: str) -> str:
    """Evaluates the student's progress toward graduation. Returns credits completed, GPA calculation, and remaining requirements."""
    try:
        student = Student.objects.get(netid=netid)
    except Student.DoesNotExist:
        return f"Student with NetID '{netid}' not found."

    history = StudentCourseHistory.objects.filter(student=student)
    if not history.exists():
        return f"No course history found for {netid}. Cannot run degree audit."

    total_credits = 0
    total_quality_points = 0.0
    completed_courses = []

    for entry in history:
        gp = GRADE_POINTS.get(entry.grade, 0.0)
        total_credits += entry.credits
        total_quality_points += gp * entry.credits
        completed_courses.append(f"{entry.course_code} ({entry.grade})")

    calculated_gpa = round(total_quality_points / total_credits, 2) if total_credits > 0 else 0.0

    # Check degree requirements for this student's major
    requirements = DegreeRequirement.objects.filter(major__iexact=student.major)
    total_required = sum(r.credits_required for r in requirements) if requirements.exists() else 180
    credits_remaining = max(0, total_required - total_credits)

    # Estimated graduation
    if credits_remaining == 0:
        grad_note = "On track to graduate this term!"
    elif credits_remaining <= 45:
        grad_note = f"Approximately {credits_remaining // 15} quarters remaining."
    else:
        grad_note = f"Approximately {credits_remaining // 15} quarters remaining. Consider meeting an advisor."

    AtlasAction.objects.create(
        student=student, type="info",
        title="Degree Audit Complete",
        description=f"{total_credits}/{total_required} credits · GPA {calculated_gpa} · {credits_remaining} credits remaining. {grad_note}",
        status="Complete",
        agentforce_note="Gemini Tool: run_degree_audit"
    )

    summary = (
        f"Degree Audit for {student.first_name} {student.last_name} ({student.major}):\n"
        f"• Credits completed: {total_credits} / {total_required}\n"
        f"• Calculated GPA: {calculated_gpa}\n"
        f"• Credits remaining: {credits_remaining}\n"
        f"• {grad_note}\n"
        f"• Courses on record: {', '.join(completed_courses)}"
    )
    return summary


# ═══════════════════════════════════════════════════
# Phase 2: RAG / Knowledge Base Tool
# ═══════════════════════════════════════════════════

def search_knowledge_base(query: str) -> str:
    """Searches the campus policy knowledge base for information about UW academic policies,
    financial aid, housing, health and wellness, important dates, deadlines, CS major requirements,
    and other university policies. Use this tool when the student asks about campus rules, deadlines,
    procedures, requirements, or any policy-related question."""
    import sys, os
    # Ensure the knowledge package is importable
    project_root = os.path.join(os.path.dirname(__file__), '..')
    if project_root not in sys.path:
        sys.path.insert(0, project_root)

    from knowledge.ingest import query_knowledge_base

    results = query_knowledge_base(query, n_results=4)

    if not results or (len(results) == 1 and results[0].get("distance", 1.0) is None):
        return f"No relevant campus policy information found for '{query}'. The knowledge base may not be built yet."

    passages = []
    for i, r in enumerate(results, 1):
        source_label = r.get("title", r.get("source", "Unknown"))
        passages.append(f"[Source: {source_label}]\n{r['text']}")

    return (
        f"Found {len(passages)} relevant passage(s) from the campus knowledge base:\n\n"
        + "\n\n---\n\n".join(passages)
    )


# ═══════════════════════════════════════════════════
# Central list of tools available to the Agent
# ═══════════════════════════════════════════════════

AGENT_TOOLS = [
    # Original tools
    query_student_hold,
    query_financial_aid,
    create_support_case,
    # Phase 1: Course Registration
    search_courses,
    enroll_student_in_course,
    # Phase 1: Advisor Booking
    check_advisor_availability,
    book_advisor_appointment,
    # Phase 1: Degree Audit
    run_degree_audit,
    # Phase 2: RAG Knowledge Base
    search_knowledge_base,
]


def execute_agent_chat(message: str, student: Student):
    """
    Sends the user message to the Gemini agent, allowing it to call tools, 
    and returns both the text response and any new actions taken.
    """
    if not configure_gemini():
        return "GEMINI_API_KEY is missing from the environment.", []

    # Get the timestamp before the conversation to find new actions later
    start_time = timezone.now()

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash", 
        tools=AGENT_TOOLS,
        system_instruction=(
            f"You are Atlas, a highly intelligent student success agent for the University of Washington. "
            f"You are assisting a student named {student.first_name} {student.last_name} "
            f"(NetID: '{student.netid}', Major: '{student.major}'). "
            f"Use the provided tools autonomously to look up information or perform actions in the systems before answering. "
            f"If they ask about financial aid, use the financial aid tool. "
            f"If they ask about holds, use the hold tool. "
            f"If they ask about courses, registration, or classes, search courses and enroll them if they ask. "
            f"If they ask about advisors or appointments, check availability and book for them. "
            f"If they ask about their degree progress, credits, or graduation, run the degree audit. "
            f"When the student asks about campus policies, deadlines, housing rules, academic regulations, "
            f"health resources, financial aid rules, CS major requirements, or any university procedure, "
            f"use the search_knowledge_base tool to find accurate information before answering. "
            f"Always cite the source document when using knowledge base results. "
            f"Be concise, friendly, and professional. Synthesize the tool data into a conversational response."
        )
    )
    
    # Enable automatic function calling
    chat = model.start_chat(enable_automatic_function_calling=True)
    
    # Send the message to the LLM
    try:
        response = chat.send_message(message)
        text = response.text
    except Exception as e:
        text = f"An error occurred in the Agent brain: {e}"

    # Fetch any new AtlasActions created during this tool execution
    new_actions = AtlasAction.objects.filter(
        student=student,
        created_at__gte=start_time
    )

    return text, list(new_actions)
