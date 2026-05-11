frappe.listview_settings['RBP Payment Event'] = {
  add_fields: ['related_doctype', 'related_name', 'payment_provider', 'status', 'event_type', 'amount', 'currency'],
  get_indicator(doc) {
    const state = doc.workflow_state || doc.status || doc.payment_status || doc.subscription_status || doc.severity || "Draft";
    const colours = {
      "Draft": "orange",
      "Pending": "orange",
      "Submitted": "blue",
      "In Review": "blue",
      "Assigned": "blue",
      "In Progress": "blue",
      "Active": "green",
      "Published": "green",
      "Complete": "green",
      "Completed": "green",
      "Paid": "green",
      "Failed": "red",
      "Error": "red",
      "Rejected": "red",
      "Cancelled": "red",
      "Archived": "grey",
      "Closed": "grey",
      "Refunded": "grey",
    };
    return [__(state), colours[state] || "blue", "status,=," + state];
  },
  onload(listview) {
    if (listview.page && listview.page.set_title_sub) {
      listview.page.set_title_sub(__("RBP admin triage"));
    }
  },
};
