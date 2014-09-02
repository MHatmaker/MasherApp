

exports.index = function(req, res){
  console.log("exports.index");
  res.render('index');
};


exports.agonewwindow = function(req, res){
  console.log("exports.agonewwindow");
  console.log("params, then query");
  console.log(req.params);
  console.log(req.query);
  console.log(req.baseUrl);
  //console.log(req);
  res.render('agonewwindow');
};


exports.partials = function (req, res) {
  console.log("exports.partials");
  var name = req.params.name;
  console.log(name);
  res.render('partials/' + name);
};
