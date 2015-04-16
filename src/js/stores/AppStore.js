var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var EventEmitter = require('events').EventEmitter;

// 讓 store 繼承 EventEmitter 一樣有幾種不同寫法，merge, assign 或是 jQuery 的 .$extend
var merge = require('react/lib/merge');
// var assign = require('object-assign');

// store 改變之後廣播出去的內容
var CHANGE_EVENT = 'change';
var request = require('superagent');

// Store 分成三個大部分：private, public, register self

//========================================================================
//
// Private vars & method

// 定義 store 需要的變數和 method，外界看不到
var _data = [];

//========================================================================
//
// Public API 外界可以呼叫的方法

var AppStore = merge(EventEmitter.prototype, {
// assign 的寫法
// var TodoStore = assign({}, EventEmitter.prototype, {

  getData: function() {
    return _data;
  },

  //為什麼這個要定義成 public ?
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  
});

//========================================================================
//
// Load Data

function parseData (argument) {
  
  // GET Position Data from Google Spreadsheets
  
  // REF
  // https://spreadsheets.google.com/feeds/list/1YJwYBacyYvjFIKZgS5cNr2IuXxUypcvvZndOJtydkm8/od6/public/values?alt=json
  // https://github.com/councilor2014/councilor2014.github.io/blob/master/app.js

  //var keyPath = "1yaW4FOHTf2n6IW8liCCZpfUOGF2qTjjXtdmk78WhJuE";
/* ===== GET JSON , Default set to 航空城事件 ======= */
  var keyPath = "1hR75qa9zGbx0mnQIzQbaIHcywDYtXy5iNo7UHkWdd7Q";
  var hash = window.location.hash.substring(1); // remove #
  if(hash){
      keyPath = hash;
  }

  var jsonPath = "https://spreadsheets.google.com/feeds/list/"+keyPath+"/od6/public/values?alt=json";
  
  var request = require('superagent');
  request
    .get(jsonPath)
    .end(function(err, res){
        if(err){
            console.log(err);
            return;
        }

        var data = res.body;
        //console.log(data);

        
        var tmp = {};

        data.feed.entry.map((value, key)=>{
           
            var anEntry = {};
            var date = value.gsx$date.$t;

            anEntry.date = date;
            anEntry.title = value.gsx$title.$t;
            anEntry.event = value.gsx$event.$t;
            anEntry.relatedNews = [];
            
            var keepFind = 1;
            do{
                

                var keyValue = "";
                if(keepFind > 1) 
                   keyValue = "_"+keepFind;
                
                //console.log(keyValue);
                
                if(value["gsx$newstitle"+keyValue] && 
                   value["gsx$newslink"+keyValue] && 
                   value["gsx$newsagency"+keyValue]){
                   
                   var newsEntry = {};
                   newsEntry.title = value["gsx$newstitle"+keyValue].$t;
                   newsEntry.link = value["gsx$newslink"+keyValue].$t;
                   newsEntry.agency = value["gsx$newsagency"+keyValue].$t;
                   
                   if(newsEntry.title!==" "&&newsEntry.title!==""){
                      anEntry.relatedNews.push(newsEntry);
                   }
                   //console.log(newsEntry);
                   

                }else{
                    //console.log("No news data");
                    keepFind = -1;
                }
                keepFind++;
                
            }while(keepFind > 0);
            
            
            
            //console.log(anEntry);
            if(anEntry.date && anEntry.event){
                
                var year = date.split('-')[0],
                    month = date.split('-')[1], 
                    day = date.split('-')[2];

                anEntry.year = year;
                anEntry.month = month;
                anEntry.day = day;

                //依照年份 push
                if(!tmp[year])
                    tmp[year]=[];

                tmp[year].push(anEntry);

                // _data.push(anEntry);

            }
          
            
        });
        for(var key in tmp){
            _data.push({
                year: key,
                events: tmp[key]
            });
        }

        AppStore.emitChange();
         
    });

}
parseData();

///////////////////////////////////////////////////////////////////////////

//========================================================================
//
// event handlers

/**
 * 向 Dispatcher 註冊自已，才能偵聽到系統發出的事件
 */

AppDispatcher.register(function(action) {
  
  switch(action.actionType) {
    
    case AppConstants.LEGI_UPDATE:
      // _update(action.item);
      // AppStore.emitChange();
      break;
    
    default:
      // no op
  }
});

module.exports = AppStore;
