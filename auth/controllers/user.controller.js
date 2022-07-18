exports.allAccess = (req, res) => {
    res.render('unregistered-content');
  };
  
  exports.studentBoard = (req, res) => {
    res.render('student-content');
  };
  
  exports.adminBoard = (req, res) => {
    res.render('admin-content');
  };