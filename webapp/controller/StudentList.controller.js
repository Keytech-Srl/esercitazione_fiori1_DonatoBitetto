sap.ui.define(
	["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/m/MessageBox", "sap/m/MessageToast"],
	(Controller, JSONModel, MessageBox, MessageToast) => {
		let controller = {
			emptyStudent: new JSONModel({
				Codice: "",
				Nome: "",
				Cognome: "",
				DatNascita: "",
				Sesso: "",
				Corso: "",
				Voto: 0,
				Lode: "",
			}),
			selectedStudent: undefined,
			studentFormModal: undefined,

			setStudent: function (oEvent) {
				this.getView().byId("editStudent").setEnabled(true);

				let selectedStudent = oEvent.getParameter("listItem").getBindingContext("ides").getObject();
				selectedStudent = new JSONModel(selectedStudent);
				this.getView().setModel(selectedStudent, "Student");

				this.selectedStudent = selectedStudent;
			},

			openStudentFormModal: async function (type) {
				this.studentFormModal ??= await this.loadFragment({ name: "ui5.crud.view.fragments.StudentFormModal" });

				if (type === "create") {
					this.studentFormModal.setTitle("Aggiungi studente");
					this.studentFormModal.getBeginButton().attachEvent("press", this.saveNewStudent, this);
					this.byId("codice").setEnabled(true);

					this.getView().setModel(this.emptyStudent, "Student");
				} else if (type === "edit") {
					this.studentFormModal.setTitle("Modifica studente");
					this.studentFormModal.getBeginButton().attachEvent("press", this.updateStudent, this);
					this.byId("codice").setEnabled(false);

					this.getView().setModel(this.selectedStudent, "Student");
				}

				this.studentFormModal.open();
			},

			closeStudentFormModal: function () {
				this.studentFormModal.getBeginButton().detachEvent("press", this.saveNewStudent, this);
				this.studentFormModal.getBeginButton().detachEvent("press", this.updateStudent, this);
				this.studentFormModal.close();
			},

			saveNewStudent: function () {
				const validInputs = this._validate();

				if (validInputs) {
					const newStudent = this.getView().getModel("Student").getData();
					this.getView()
						.getModel("ides")
						.create("/Zet_test_Set", newStudent, {
							success: function () {
								this.studentFormModal.getBeginButton().detachEvent("press", this.saveNewStudent, this);
								this.closeStudentFormModal();
								MessageToast.show("Studente creato!");
							}.bind(this),
							error: function (oError) {
								MessageBox.error(`${oError.message} (${oError.statusCode})`);
							},
						});
				} else {
					MessageBox.error("Impossibile creare il nuovo studente. Correggi gli errori e riprova.");
				}
			},

			updateStudent: function () {
				const validInputs = this._validate();

				if (validInputs) {
					const student = this.getView().getModel("Student").getData();
					this.getView()
						.getModel("ides")
						.update(`/Zet_test_Set('${student.Codice}')`, student, {
							success: function () {
								this.studentFormModal.getBeginButton().detachEvent("press", this.updateStudent, this);
								this.closeStudentFormModal();
								MessageToast.show("Studente modificato!");
							}.bind(this),
							error: function (oError) {
								MessageBox.error(`${oError.message} (${oError.statusCode})`);
							},
						});
				} else {
					MessageBox.error("Impossibile effettuare la modifica. Correggi gli errori e riprova.");
				}
			},

			deleteStudent: function (id) {
				this.getView().getModel("ides").remove(`/Zet_test_Set('${id}')`, {
					success: function () {
						MessageToast.show("Studente eliminato!");
					}.bind(this),
					error: function (oError) {
						MessageBox.error(`${oError.message} (${oError.statusCode})`);
					},
				});
			},

			_validate: function () {
				let isValid = true;
				this.getView()
					.byId("form")
					.getContent()
					.forEach((el) => {
						if (el instanceof sap.m.InputBase) {
							const binding = el.getBinding("value");
							try {
								binding.getType().validateValue(binding.getValue());
							} catch (e) {
								isValid = false;
							}
						}
					});

				return isValid;
			},
		};

		return Controller.extend("ui5.crud.controller.StudentList", controller);
	}
);
