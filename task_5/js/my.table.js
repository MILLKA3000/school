$.widget('smile.newTableSmile', $.smile.tableSmile, {
	name: {},
	allUsers: [],
	infUser: {},
	url: '',
	column: '',
	_create: function() {
		$("body").append($.parseHTML("<div id='dialog' title='Information from user'></div>"));
     	return this._super();
  	},
	onClick: function(element){
		var button = element.target;
		if($(button).attr("class").split(' ')[1] == "view"){

			this.column = $($(this.element).find("th")[0]).data("column");
			this.name = $($(button).parent().parent().find("td")[0]).text();

			this.userAjax();
			$("#dialog").dialog();
		}
		else{
			$(element.target).parent().parent().remove();
		}
	},
	setingDialog: function(userObject){
		var html = "<ul>\n",
		self = this;
		$.each(userObject, function(key, value){
			if (typeof value == "object") {
				html += "<li>" + key + ": " + self.setingDialog(value) + "</li>\n";;
			}
			else{
				html += "<li>" + key + ": " + value + "</li>\n";
			}
		});
		html += "</ul>";
		return html;
	},
	userAjax: function(){
		var self = this;
        if (self.ajaxRequest.init.length) {
            $.ajax({
                url: self.ajaxRequest.init,
                method: 'GET',
                cache: true,
                success: function (data) {
                	var inf;
                	if (typeof(data) == 'object') {
						$.each(data, function(key, value){
							inf = value;
							$.each(value, function(key, value){
								if(self.column == key && self.name == value){
									self.infUser = inf;
								}
							})
						});   
						$("#dialog").empty();
						$("#dialog").append($.parseHTML(self.setingDialog(self.infUser)));             	    
                	}
                }
            });
        }
	},
	_refresh: function(){
		this._super();
		this._on($(".tableButton"), {
            click: "onClick",
        });

	},
	onLoadAfter: function () {
     	this._super();
     	$(this.columnName).each(function(){
     		this["button"] = $.parseHTML(
     			"<a href='#' class='tableButton delete'>delete</a>"+
     			"<a href='#' class='tableButton view'>view</a>");
     	});
  	},
  	_init: function(){
  		this._super();
  		this.allowedColumn.push("button");
  	}

});