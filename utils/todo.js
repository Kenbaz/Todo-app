function itemEditingTemplate() {
  // ui.todoItem.style.display = "none";
  mk("form", { className: "edit-item-form" }, [
    mk("div", { className: "edit-form-group" }, [
      mk("input", {
        className: "todo-text",
        id: `${item.id}`,
        type: "text",
        value: `${item.text}`,
      }),
    ]),
    (ui.updateTodoBtns = mk("div", { className: "update-todo-btn-group" }, [
      mk("button", { className: "saveBtn", type: "submit" }, ["Save"]),
      mk("button", { className: "cancelBtn", type: "button" }, ["Cancel"]),
    ])),
  ]);
}
 mk("img", {
              src: "./utils/icons/edit_note_FILL0_wght400_GRAD0_opsz24.png",
              className: "editBtn",
              alt: "edit button",
              onclick: () => renderConditionalUi()
 })

 (ui.editbtn = mk("img", {
               src: "./utils/icons/edit_note_FILL0_wght400_GRAD0_opsz24.png",
               className: "editBtn",
               alt: "edit button",
               onclick: () => renderConditionalUi(),
             }))