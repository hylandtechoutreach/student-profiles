const Student = require("./models/Student");

module.exports = {
	addStudent: async function(studentObj) {
    const forumMessage = new Student({
      message: studentObj.message,
    });

    await forumMessage.save();
	},
}