exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.render('user-content');
  };
  
  exports.adminBoard = (req, res) => {
    res.render('admin-content');
  };
  
  exports.moderatorBoard = (req, res) => {
    res.render('mod-content');
  };