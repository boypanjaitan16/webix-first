import {JetView} from "webix-jet";
import {BASE_URL} from "../helpers/info";

export default class HistoryView extends JetView{
	config(){
		return {
			view		: "datatable",
			id			: 'table',
			autoConfig	: true,
			scrollX		: true,
			select		: true,
			onClick:{
				"ic_del_btn" : function  (event, cell, target) {
					webix.confirm({
						title: "Delete History",
						text: "Are you sure to proceed ?",
						type:"confirm-error"
					})
						.then(function(result){
							webix.message("Now deleting ...");
							webix.ajax().post(BASE_URL+'/log/delete', {
								id 	: cell.row
							})
								.catch(e => {
									webix.alert({
										title	: 'Error',
										text	: e.toString(),
										type	: 'alert-error'
									});
								})
								.then(res => {
									const result	= res.json();

									if (result.status === 'success'){
										$$('table').remove(cell);
									}
									else {
										webix.alert({
											title	: 'Error',
											text	: result.message,
											type	: 'alert-error'
										});
									}
								});
						})
						.fail(function(){

						});
				}
			},
			columns	: [
				{id:'id', header:'#', fillspace: true},
				{id:'title', header:'Title', fillspace:2},
				{
					id:'result', header:'Download Link',fillspace:true, template: obj => {
						return `<a target="_blank" class="btn" href="${obj.result}"><small>Visit Link</small> <i class="mdi mdi-open-in-new"></i> </a>`;
					}
				},
				{id:'date', header: 'Date', fillspace:true},
				{
					id:'btn', header:{
						css		: 'del_btn',
						text	: 'Delete'
					},
					template 	: obj => {
						return '<i class="mdi mdi-trash-can ic_del_btn"></i>';
					}
				}
			]
		};

		/*return {
			type:"space",
			rows:[
				{ template:"Download History", type:"header", css:"text_center" },
				{
					view		: "datatable",
					select:true,
					columns	: [
						{id:'id', header:'#', fillspace: true},
						{id:'title', header:'Title', fillspace:2},
						{
							id:'result', header:'Download Link',fillspace:true, template: obj => {
								return `<a target="_blank" class="webix_primary" href="${obj.result}">Visit Link</a>`;
							}
						},
						{id:'date', header: 'Date', fillspace:true}
					]
				}
			]
		};*/
	}
	init(view){
		const authService 	= this.app.getService("auth");
		const detail		= authService.getUser();

		webix.ajax().post(BASE_URL+'/log', {
			username 	: detail.username
		})
			.catch(e => {
				webix.alert({
					title	: 'Error',
					text	: e.toString(),
					type	: 'alert-error'
				});
			})
			.then(result => {
				const obj	= result.json();

				if(obj.status === 'success') {
					const data = new webix.DataCollection(
						{
							data	: obj.data,
							schema	: {
								$init	: function (object) {
									object.Result	= 'link';
								}
							}
						});

					view.parse(data);
				}
				else {
					webix.alert({
						title	: 'Error',
						text	: obj.message,
						type	: 'alert-error'
					});
				}
			});
	}
}
