const express = require('express')
const fs = require('fs')
const strformat = require('strformat');
const phantom = require('phantom-render-stream');

class Webserver{
  constructor(){
    this.render = phantom();
    this.app = express()
    this.app.set('views', './views')
    this.app.set('view engine', 'hbs');
    this._loadTemplates();
  }
  listen(port){
    this.port = port;
    this.app.listen(port)
  }
  _loadTemplates(){
    let path = './templates'
    let files = fs.readdirSync(path);
    let templateConfigs = [];
    files.forEach((file)=>{
      file = path + '/' + file;
      templateConfigs.push(JSON.parse(fs.readFileSync(file,{encoding:'utf8'})))
    })
    templateConfigs.forEach((config)=>{
      this._loadConfig(config)
    })
  }
  _loadConfig(config){
    this.app.get('/',(req, res)=>{
      res.redirect('https://github.com/roycwc/foaashk')
    })
    this.app.get('/i'+config.path,(req,res)=>{
      let userPath = req.originalUrl.substr(2);
      this._renderImage(userPath, req, res);
    })
    this.app.get(config.path+'\.jpg',(req,res)=>{
      let userPath = req.originalUrl.slice(0,-4)
      this._renderImage(userPath, req, res);
    })
    this.app.get(config.path, (req,res)=>{
      if (req.get('Accept')=='application/json'){
        return this._renderJson(config, req, res)
      }
      this._renderHtml(config, req, res)
    })
  }
  _renderJson(config, req, res){
    let title = config.title;
    let by = config.by || null;
    let input = req.params;
    let titleText = strformat(title, input);
    let byText = by ? strformat(by, input) : null;
    let text = byText ?  titleText + byText : titleText;
    res.json({text:text});
  }
  _renderHtml(config, req, res){
    let path = config.path;
    let title = config.title;
    let by = config.by || null;
    let input = req.params;
    let titleText = strformat(title, input);
    let byText = by ? strformat(by, input) : null;
    res.render('index', {title:titleText, by:byText});
  }
  _renderImage(userPath, req, res){
    let imageStream = this._getImageStream('http://localhost:'+this.port+userPath);
    imageStream.pipe(res)
  }
  _getImageStream(url){
    return this.render(url, {format:'jpeg', quality: 90, width: 387, height: 129});
  }
}
module.exports = Webserver;
