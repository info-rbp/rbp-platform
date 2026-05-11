frappe.listview_settings["RBP Decision Desk Option"] = {
  add_fields: ["decision_request", "option_label", "risk_level", "recommended", "sort_order"],
  get_indicator(doc) {
    const state = doc.recommended ? "Recommended" : doc.risk_level || "Draft";
    const colours = {
      Recommended: "green",
      Low: "green",
      Medium: "orange",
      High: "red",
      Draft: "orange",
    };
    return [__(state), colours[state] || "blue", "risk_level,=," + state];
  },
  onload(listview) {
    if (listview.page && listview.page.set_title_sub) {
      listview.page.set_title_sub(__("RBP admin triage"));
    }
  },
};
