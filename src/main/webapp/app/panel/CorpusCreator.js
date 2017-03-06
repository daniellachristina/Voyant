Ext.define('Voyant.panel.CorpusCreator', {
	extend: 'Ext.form.Panel',
	requires: ['Ext.form.field.File'],
	requires: ['Voyant.data.model.Corpus'],
	mixins: ['Voyant.panel.Panel'],
	alias: 'widget.corpuscreator',
	isConsumptive: true,
    statics: {
    	i18n: {
    	},
    	api: {
    		inputFormat: undefined,
    		xmlDocumentsXpath: undefined,
    		xmlContentXpath: undefined,
    		xmlTitleXpath: undefined,
    		xmlAuthorXpath: undefined,
    		tokenization: undefined,
    		adminPassword: undefined,
    		accessPassword: undefined,
    		accessModeWithoutPassword: undefined,
    		tableDocuments: undefined,
    		tableContent: undefined,
    		tableTitle: undefined,
    		tableAuthor: undefined,
    		corpusTitle: undefined,
    		corpusSubTitle: undefined
    	}
    },
    
    constructor: function(config) {
        this.callParent(arguments);
        config = config || {};
        var me = this;
    	this.mixins['Voyant.panel.Panel'].constructor.call(this, 
    			Ext.apply(config, {
    				includeTools: {
    					gear: true,
    					help: true,
    					language: this.getLanguageToolMenu()
    				}
    			})
    	);
    	
    },
    
    initComponent: function() {
        var me = this;

        Ext.apply(me, {
    		title: this.localize('title'),
    		width: 800,
    		frame: true,
    		padding: 10,
    		style: {
    		    borderColor: '#aaa',
    		    borderStyle: 'solid'
    		},
    		frameHeader: true,
    		layout: {
    			type: 'vbox',
    			align: 'middle'
    		},
	    	dockedItems: [{
	    		xtype: 'toolbar',
        		enableOverflow: true,
                dock: 'bottom',
    	    	buttonAlign: 'right',
//    	    	defaultButtonUI : 'default',
	    		items: [{
	    			text: me.localize('Open'),
                    glyph: 'xf115@FontAwesome', // not visible
	    			tooltip: me.localize('SelectExisting'),
	    			hidden: this.getCorpus()!=undefined,
	    			handler: function() {
	    				Ext.create('Ext.window.Window', {
	    				    title: me.localize('Open'),
	    				    layout: 'fit',
	    				    modal: true,
	    				    items: {  // Let's put an empty grid in just to illustrate fit layout
	    				        xtype: 'form',
	    				        submitEmptyText: false,
	    				        margin: '5,5,5,5',
	    				        items: {
	    				        	xtype: 'corpusselector'
//	    				            xtype:'combo',
//	    				            labelWidth: 150,
//	    				            fieldLabel:'Choose a corpus:',
//	    				            name:'corpus',
//	    				            queryMode:'local',
//	    				            store:[['shakespeare',"Shakespeare's Plays"],['austen',"Austen's Novels"]],				            
//	    				            forceSelection:true
	    				        },
	    				        buttons: [
	    				        	{
	    				        		text: me.localize('Open'),
	    			                    glyph: 'xf00c@FontAwesome',
	    				        		handler: function(btn) {
	    				        			var form = btn.up('form').getForm();
	    				        			var corpus = btn.up('form').getForm().getValues().corpus;
	    				        			if (corpus!='') {
	    				        				me.loadCorpus({corpus: corpus});
		    				        			btn.up('window').close();
	    				        			}
	    				        			else {
	    				    	        		Ext.Msg.show({
	    				    	        		    title: me.localize('SelectExisting'),
	    				    	        		    message: me.localize('PleaseSelectExisting'),
	    				    	        		    buttons: Ext.Msg.OK,
	    				    	        		    icon: Ext.Msg.ERROR
	    				    	        		});
	    				        			}
	    				        		},
	    				        		flex: 1
	    				            },{
	    				        		text: me.localize('cancel'),
	    			                    glyph: 'xf00d@FontAwesome',
	    				        		flex: 1,
	    				        		handler: function(btn) {
	    				        			btn.up('window').close();
	    				        		}
	    				        	}
	    				        ]
	    				    }
	    				}).show();
	    			}
	    		},{
    	        	xtype: 'fileuploadfield',
                    glyph: 'xf093@FontAwesome',
    	        	name: 'upload',
        	    	buttonOnly: true,
        	    	hideLabel: true,
		            ui: 'default-toolbar',
        	    	buttonText: me.localize('Upload'),
        	    	listeners: {
        	    		render: function(filefield) {
        	    			filefield.fileInputEl.dom.setAttribute('multiple', true);
        		        	Ext.tip.QuickTipManager.register({
       		                 target: filefield.getEl(),
       		                 text: me.localize('UploadLocal')
       		             	});
        	            },
        	            beforedestroy: function(cmp) {
	                		Ext.tip.QuickTipManager.unregister(cmp.getEl());
	                	},
        	            change: function(filefield, value) {
        	            	if (value) {
            	            	var form = filefield.up('form').getForm();
            	            	if (form.isValid()) {
            	            		var files = filefield.fileInputEl.dom.files;
            	            		var badFilesRe = /\.(png|gif|jpe?g|xls|mp[234a]|mpeg|exe|wmv|avi|ppt|mpg|tif|wav|mov|psd|wma|ai|bmp|pps|aif|pub|dwg|indd|swf|asf|mbd|dmg|flv)$/i;
            	            		var goodFilesRe = /\.(txt|pdf|html?|xml|docx?|rtf|pages|odt|zip|jar|tar|gz|ar|cpio|bzip2|bz2|gzip|xlsx?)$/i;
            	            		var badFiles = [];
            	            		var unknownFiles = [];
            	            		for (var i = 0, len = files.length; i<len; i++) {
            	            			var filename = files[i].name;
            	            			if (badFilesRe.test(filename)) {
            	            				badFiles.push(filename.split("/").pop());
            	            			}
            	            			else if (!goodFilesRe.test(filename)) {
            	            				unknownFiles.push(filename.split("/").pop());
            	            			}
            	            		}
            	            		if (badFiles.length>0 || unknownFiles.length>0) {
            	            			var file = filefield;
            	            			Ext.Msg.show({
            	            				title: me.localize("fileTypesWarning"),
            	            				icon: Ext.MessageBox.ERROR,
            	            				message: me.localize('fileTypesMessage')+'<ul>' +
            	            					(badFiles.length > 0 ? ('<li>'+me.localize("badFiles") + badFiles.slice(0, 5).join(", ") + (badFiles.length>5 ? '…' : '') + '</li>') : '') +
            	            					(unknownFiles.length>0 ? ('<li>' +me.localize("unknownFiles") + unknownFiles.slice(0, 5).join(", ") + (unknownFiles.length>5 ? '…' : '') +'</li>') : '')+
            	            					'</ul>'+me.localize('sureContinue'),
            	            				buttons: Ext.Msg.YESNO,
            	            				fn: function(btn) {
            	            			        if (btn === 'yes') {
            	            			        	me.loadForm(form);
            	            			        }
            	            			        else {
            	            			        	file.reset(); // make sure we can trigger a change next time
            	            			        	file.fileInputEl.dom.setAttribute('multiple', true);
            	            			        }
            	            			    },
            	            				scope: form
            	            			});
            	            		}
            	            		else {
            	            			me.loadForm(form);
            	            		}
            	            	}
        	            	}
        	            }
        	    	}
	    		},'->', {
	    	    	xtype: 'button',
	    	    	scale: 'large',
        			glyph: 'xf00d@FontAwesome',
	    	    	text: this.localize('cancel'),
	    	    	hidden: this.getCorpus()==undefined,
	    	    	handler: function(btn) {
	    	        	var win = this.up("window");
	    	        	if (win && win.isFloating()) {
	    	        		win.close();
	    	        	}
	    	    	}
	    	    }, {
	    	    	xtype: 'button',
	    	    	scale: 'large',
                    glyph: 'xf00c@FontAwesome',
	    	    	text: this.localize('reveal'),
	    	    	ui: 'default',
	    	    	width: 200,
	    	    	handler: function(btn) {
	    	        	var input = btn.up('form').down('#input').getValue();
	    	        	if (input !== '') {
	    	        		var api = me.getApiParams();
	    	            	delete api.view;
	    	            	delete api.stopList;
	    	        		if (api.inputFormat && input.trim().indexOf("<")!==0) {
	    	        			Ext.Msg.confirm(me.localize('error'), me.localize('errorNotXmlContinue'), function(buttonId) {
	    	        				if (buttonId=='yes') {
				    	        		me.loadCorpus(Ext.apply(api, {input: input}));
	    	        				}
	    	        			}, me);
	    	        		}
	    	        		else {
		    	        		me.loadCorpus(Ext.apply(api, {input: input}));
	    	        		}
	    	        	}
	    	        	else {
	    	        		Ext.Msg.show({
	    	        		    title: me.localize('noTextProvided'),
	    	        		    message: me.localize('pleaseProvideText'),
	    	        		    buttons: Ext.Msg.OK,
	    	        		    icon: Ext.Msg.ERROR
	    	        		});
	    	        	}
	    	    	}
	    	    }]
	    	}],
	    	items: {
    	    	xtype: 'textareafield',
    	    	width: 800,
    	    	height: 100,
    	    	itemId: 'input',
    	    	emptyText: this.localize('emptyInput')
	    	}    
        });
        
        me.callParent(arguments);
    },
    
    loadForm: function(form) {
    	var params = {tool: this.getCorpus() ? 'corpus.CorpusMetadata' : 'corpus.CorpusCreator'};
    	if (this.getCorpus()) {
    		Ext.apply(params, {
    			corpus: this.getCorpus().getId(),
    			addDocuments: true
    		})
    	};
    	var apiParams = this.getApiParams();
    	delete apiParams.view;
    	delete apiParams.stopList;
    	Ext.apply(params, apiParams);
    	var view = this.getApplication().getViewport();
		view.mask(this.localize('uploadingCorpus'));
		form.submit({
			url: this.getTromboneUrl(),
			params: params,
			failure: function(form, action) { // we always fail because of content-type
            	view.unmask();
				if (action.result) {
					var corpusParams = {corpus: action.result.corpus ? action.result.corpus.metadata.id : action.result.stepEnabledCorpusCreator.storedId};
					Ext.apply(corpusParams, apiParams); // adding corpusTitle & corpusSubTitle here
					
					this.setCorpus(undefined)
					this.loadCorpus(corpusParams);
				}
			},
			scope: this
		});
    },
   
    loadCorpus: function(params) {
    	if (this.getCorpus()) {
    		Ext.apply(params, {
    			corpus: this.getCorpus().getId(),
    			addDocuments: true
    		})
    	};
    	
    	var win = this.up("window");
    	if (win && win.isFloating()) {
    		win.close();
    	}
    	
		this.getApplication().loadCorpusFromParams(params);
    },
    
    showOptionsClick: function(panel) {
    	var me = panel;
    	if (me.optionsWin === undefined) {
    		me.optionsWin = Ext.create('Ext.window.Window', {
    			title: me.localize('gearWinTitle'),
    			closeAction: 'hide',
//    			width: 500,
    			layout: 'fit',
    			bodyPadding: 10,
    			items: [{
    				xtype: 'form',
    				defaultType: 'textfield',
        			maxHeight: me.getApplication().getViewport().getHeight()-300,
        			scrollable: true,
    				fieldDefaults: {
    					labelAlign: 'right',
    					labelWidth: 110,
    					width: 350
    				},
    				items: [
						{
						    xtype:'combo',
						    fieldLabel: me.localize('inputFormat'),
						    labelWidth: 90, // try to align with fieldset
						    name: 'inputFormat',
						    queryMode:'local',
						    store:[['',me.localize('inputFormatAuto')],['dtoc','DToC: Dynamic Table of Contexts'],['TEI',"TEI: Text Encoding Initative"],['TEI',"TEI Corpus"],['RSS',"Really Simple Syndication: RSS"]],
						    value: ''
						},{
							xtype: 'container',
							html: '<p><i>'+new Ext.Template(me.localize('advancedOptionsText')).applyTemplate([me.getBaseUrl()+'docs/#!/guide/corpuscreator-section-xml'])+'</i></p>',
							width: 375
						},{
	        				xtype: 'fieldset',
	                        title: "<a href='"+me.getBaseUrl()+"docs/#!/guide/' target='voyantdocs'>"+me.localize('corpus')+"</a>",
	                        collapsible: true,
	                        collapsed: true,
	                        defaultType: 'textfield',
	                        items: [
	                            {
	    							xtype: 'container',
	    							html: '<p><i>'+'</i></p>',
	    							width: 375
	                            },{
									fieldLabel: me.localize('corpusTitle'),
									name: 'corpusTitle'
								},{
									fieldLabel: me.localize('corpusSubTitle'),
									name: 'corpusSubTitle'
								}
							]
						},{
	        				xtype: 'fieldset',
	                        title: "<a href='"+me.getBaseUrl()+"docs/#!/guide/corpuscreator-section-xml' target='voyantdocs'>"+me.localize('xmlOptions')+"</a>",
	                        collapsible: true,
	                        collapsed: true,
	                        defaultType: 'textfield',
	                        items: [
	                            {
	    							xtype: 'container',
	    							html: '<p><i>'+me.localize("xmlOptionsText")+'</i></p>',
	    							width: 375
	                            },{
									fieldLabel: me.localize('xpathContent'),
									name: 'xmlContentXpath'
								},{
									fieldLabel: me.localize('xpathTitle'),
									name: 'xmlTitleXpath'
								},{
									fieldLabel: me.localize('xpathAuthor'),
									name: 'xmlAuthorXpath'
								},{
									fieldLabel: me.localize('xpathDocuments'),
									name: 'xmlDocumentsXpath'
								},{
									fieldLabel: me.localize('xpathGroupBy'),
									name: 'xmlGroupByXpath'
								}
							]
						},{
	        				xtype: 'fieldset',
	                        title: "<a href='"+me.getBaseUrl()+"docs/#!/guide/corpuscreator-section-tables' target='voyantdocs'>"+me.localize('tableOptions')+"</a>",
	                        collapsible: true,
	                        collapsed: true,
	                        defaultType: 'textfield',
	                        items: [{
	    							xtype: 'container',
	    							html: '<p><i>'+new Ext.Template(me.localize('tableOptionsText')).applyTemplate([me.getBaseUrl()+'docs/#!/guide/corpuscreator-section-tables'])+'</i></p>',
	    							width: 375
	                        	},{
								    xtype:'combo',
									fieldLabel: me.localize('tableDocuments'),
								    name: 'tableDocuments',
								    queryMode:'local',
								    store:[['',me.localize('tableDocumentsTable')],['rows',me.localize('tableDocumentsRows')],['columns',me.localize("tableDocumentsColumns")]],
								    forceSelection:true,
								    value: ''
								},{
	    							xtype: 'container',
	    							html: '<p><i>'+me.localize("tableNoHeadersRowText")+'</i></p>',
	    							width: 375
	                            },{
									fieldLabel: me.localize("tableNoHeadersRow"),
									xtype: 'checkboxfield',
									name: 'tableNoHeadersRow',
									inputValue: "true"
								},{
	    							xtype: 'container',
	    							html: '<p><i>'+me.localize("tableContentText")+'</i></p>',
	    							width: 375
	                            },{
									fieldLabel: me.localize('tableContent'),
									validator: function(val) {return me.validatePositiveNumbersCsv.call(me, val)},
									name: 'tableContent'
								},{
	    							xtype: 'container',
	    							html: '<p><i>'+me.localize("tableMetadataText")+'</i></p>',
	    							width: 375
	                            },{
									fieldLabel: me.localize('tableAuthor'),
									validator: function(val) {return me.validatePositiveNumbersCsv.call(me, val)},
									name: 'tableAuthor'
								},{
									fieldLabel: me.localize('tableTitle'),
									validator: function(val) {return me.validatePositiveNumbersCsv.call(me, val)},
									name: 'tableTitle'
								}
							]
						},{
	        				xtype: 'fieldset',
	                        title: "<a href='"+me.getBaseUrl()+"docs/#!/guide/corpuscreator-section-tokenization' target='voyantdocs'>"+me.localize('tokenizationOptions')+"</a>",
	                        collapsible: true,
	                        collapsed: true,
	                        items: [
								{
								    xtype:'combo',
								    fieldLabel: me.localize('tokenization'),
								    name: 'tokenization',
								    queryMode:'local', //?
								    store:[['',me.localize('tokenizationAuto')],['wordBoundaries',me.localize("tokenizationWordBoundaries")],['whitespace',me.localize("tokenizationWhitespace")]],
								    forceSelection:true,
								    value: ''
								}
							]
						},{
	        				xtype: 'fieldset',
	                        title: "<a href='"+me.getBaseUrl()+"docs/#!/guide/corpuscreator-section-access-management' target='voyantdocs'>"+me.localize('accessOptions')+"</a>",
	                        collapsible: true,
	                        collapsed: true,
	                        defaultType: 'textfield',
	                        items: [
	                            {
	    							xtype: 'container',
	    							html: '<p><i>'+me.localize("accessOptionsText")+'</i></p>',
	    							width: 375
	                            },{
									fieldLabel: me.localize('adminPassword'),
									name: 'adminPassword'
								},{
									fieldLabel: me.localize('accessPassword'),
									name: 'accessPassword'
								},{
	    							xtype: 'container',
	    							html: '<p><i>'+me.localize("accessModeWithoutPasswordText")+'</i></p>',
	    							width: 375
	                            },{
								    xtype:'combo',
									fieldLabel: me.localize('accessModeWithoutPassword'),
								    name: 'noPassordAccess',
								    queryMode:'local',
								    store:[['',me.localize('accessModeNonConsumptive')],['none',me.localize("accessModeNone")]],
								    forceSelection:true,
								    value: ''
								}
							]
						}
						
					]
    			}],
    			buttons: [{
    				text: me.localize('ok'),
    				handler: function(button, event) {
    					var win = button.findParentByType('window');
    					var form = win.down('form');
    					if (form.isValid()) {
        					var params = form.getValues();
        					me.setApiParams(params);
        					win.hide();
    					}
    					else {
    						me.showError({
    							message: me.localize("invalidForm")
    						})
    					}
    				}
    			},{
    				text: me.localize('cancel'),
    				handler: function(button, event) {
    					button.findParentByType('window').hide();
    				}
    			}]
    		});
    	}
    	me.optionsWin.show();
    },
    
    validatePositiveNumbersCsv: function(val) {
    	val = val.trim();
    	if (val.length>0) {
        	if (/[^\d,+ ]/.test(val)) {
        		return this.localize("numbersCommasOnly");
        	}
        	if (/\d\s+\d/.test(val)) {
        		return this.localize("numbersNeedCommas");
        	}
        	var numbers = val.split(/\s*[,+]\s*/), number;
        	for (var i=0, len=numbers.length; i<len; i++) {
        		number = numbers[i];
        		if (number.length==0) {
        			return this.localize("numberEmpty")
        		}
        		if (parseInt(number)==0) {
        			return this.localize("numberZero")
        		}
        	}
    	}
    	return true;
	}
    
});