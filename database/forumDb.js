const Student = require("./models/forumMessage");

module.exports = {
	addStudent: async function(studentObj) {
    const forumMessage = new Student({
      message: studentObj.message,
    });

    await forumMessage.save();
	},
}