/** @jsx React.DOM */
"use strict";
var React = require('react/addons');

require("./Records.css");
var Records = React.createClass({
  
  render() {
    var {data, currentTerm} = this.props;
    console.log(data);
    

    var years = data.map((item,key)=>{
    	
        //每一年
        var events = item.events.map((value, k)=>{

            var relatedNewsItem = "";
            
            //console.log(value.relatedNews.length > 0);
            relatedNewsItem = value.relatedNews.map((newsValue,newsIndex)=>{
                return (
                    <div>
                        <a className="Records-link"
                          href={newsValue.link}
                          target="_blank">{newsValue.title}</a>（{newsValue.agency}）
                    </div>   
                )
            });

            var relatedNewsTitle = (value.relatedNews.length > 0) ? <div className="Records-relatedNewsItitle"></div> : "";
           

            return (
            <div className="Records-entry"
                 key={k}>
                <div className="Records-unitPoint" />
                <div className="Records-flexItem">
                    <div className="Records-flexLeft">{value.month} / {value.day}</div>
                    <div className="Records-flexMain">
                    {value.event}
                    {relatedNewsTitle}
                    {relatedNewsItem}
                    </div>
                </div>
            </div>
            )

        })

        return (
        	<div className="Records-year"
                 key={key}>
                 <div className="Records-yearTitle">{item.year} 年</div>
                 {events}
        	</div>
        )
    });
    return (
      <div className="Records">
        {years}
      </div>
    );
  }
});


module.exports = Records;


