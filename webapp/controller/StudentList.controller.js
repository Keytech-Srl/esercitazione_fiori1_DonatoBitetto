sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"], (Controller, JSONModel) => {
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
				this.studentFormModal.getBeginButton().attachEventOnce("press", this.saveNewStudent, this);

				this.getView().setModel(this.emptyStudent, "Student");
			} else if (type === "edit") {
				this.studentFormModal.setTitle("Modifica studente");
				this.studentFormModal.getBeginButton().attachEventOnce("press", this.updateStudent, this);

				this.getView().setModel(this.selectedStudent, "Student");
			}

			this.studentFormModal.open();
		},

		closeStudentFormModal: function () {
			this.studentFormModal.close();
		},

		saveNewStudent: function () {
			const validInputs = this._validate();

			if (validInputs) {
				const newStudent = this.getView().getModel("Student").getData();
				this.getView()
					.getModel("ides")
					.create("/Zet_test_Set", newStudent, {
						success: function (oData) {
							console.log(oData);
							this.closeStudentFormModal();
						}.bind(this),
						error: function (oError) {
							console.error("Errore nella creazione del nuovo studente:", oError);
						},
					});
			}
		},

		updateStudent: function () {
			const validInputs = this._validate();

			if (validInputs) {
				const student = this.getView().getModel("Student").getData();
				this.getView()
					.getModel("ides")
					.update(`/Zet_test_Set('${student.Codice}')`, student, {
						success: function (oData) {
							console.log(oData);
							this.closeStudentFormModal();
						}.bind(this),
						error: function (oError) {
							console.error("Errore nella modifica del nuovo studente:", oError);
						},
					});
			}
		},

		_validate: function () {
			let isValid = true;
			this.getView()
				.byId("form")
				.getContent()
				.forEach((el) => {
					if (el instanceof sap.m.InputBase) {
						const binding = el.getBinding("value")
						try {
							binding.getType().validateValue(binding.getValue())	
							console.log(binding.getValue());
						}catch(e){
							console.error(e);
							isValid = false;
						}
					}
				});

			return isValid;
		},
	};

	return Controller.extend("ui5.crud.controller.StudentList", controller);
});
