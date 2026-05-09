"""
RBP Home Page Context

Provides context variables for the home page.
Frappe will automatically call get_context() for www/index.html.
"""


def get_context(context):
    context.title = "Remote Business Partner"
    context.no_cache = 1
    # Future: add dynamic context such as featured services, latest offers, etc.
