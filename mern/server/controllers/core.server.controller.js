const index=(req,res)=>{
    return  res.sendFile('index.html', {root: path.join(__dirname, 'public')});
  }

  module.exports = {
    index: index
  }