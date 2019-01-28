var mongoose = require( 'mongoose' );
var Main = require('../models/main');
var config = require('../config');


exports.savemain = function(req, res, next){
	const uid = req.params.id;
	const ticketid = req.body.ticketid;
	const dt = req.body.mdate;
    const tool = req.body.mtool;
    const desc = req.body.mdesc;
	const tech = req.body.mtech;
	const rsdate = req.body.rsdate;
	const rcom = req.body.rcom;
	const fixdate = req.body.fixdate;
	const rtech = req.body.rtech;
	const mainid = req.body.mainid;
	
	

    	if (mainid) {
		//Edit maintenance
		Main.findById(mainid).exec(function(err, main){
			if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }
				
			if(main) {
				main.ticketid = ticketid;
				main.maindate = dt;
				main.maintool = tool;
				main.maindesc = desc;
				main.maintech = tech;
				main.rsdate = rsdate;
				main.rcom = rcom;
				main.fixdate = fixdate;
				main.rtech = rtech;
			}
			main.save(function(err) {
				if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }
				res.status(201).json({
					success: true,
					message: 'Maintenance updated successfully'
				});
			});
		});

	}else{
		Main.findOne({ ticketid: ticketid }, function(err, existingMain) {
			if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err}); }
	
			// If user is not unique, return error
			if (existingMain) {
				return res.status(201).json({
					success: false,
			message: 'Ticket id already exists.'
				});
			}
	
			// If no error, create account
			let oMain = new Main({
				userid: uid,
				ticketid: ticketid,
				maindate : dt,
				maintool : tool,
				maindesc : desc,
				maintech : tech,
				rsdate : rsdate,
				rcom : rcom,
				fixdate : fixdate,
				rtech : rtech,
			});
	
			oMain.save(function(err, oMain) {
				if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err}); }
			
				res.status(201).json({
					success: true,
			message: 'Maintenance saved successfully'
				});
			});
		});
		

	}
    }


exports.delmain = function(req, res, next) {
	Main.remove({_id: req.params.id}, function(err){
        if(err){ res.status(400).json({ success: false, message: 'Error processing request '+ err }); }
        res.status(201).json({
		success: true,
		message: 'Maintenance removed successfully'
	});
    });
}

exports.getmain = function(req, res, next){
	Main.find({_id:req.params.id}).exec(function(err, main){
        if(err){ res.status(400).json({ success: false, message:'Error processing request '+ err }); 
        }
        res.status(201).json({
		success: true, 
		data: main
	});
    });
}

exports.maintotal = function(req, res, next){
    const uid = req.params.id || req.param('uname');
    const rptype = req.body.report || req.param('report');
    const from_dt = req.body.startdt || req.param('startdt');
    const to_dt = req.body.enddt || req.param('enddt');
    const fromdt = new Date(from_dt);
    const todt = new Date(to_dt);
    
    let match = {};
    
    if(rptype === 'opt1'){
        let oDt = new Date();
        let month = oDt.getUTCMonth() + 1; //months from 1-12
        let year = oDt.getUTCFullYear();

        let fdt = new Date(year + "/" + month + "/1");
        let tdt = new Date(year + "/" + month + "/31");

        match = { "$match": {userid:uid, maindate:{$gte: fdt, $lte: tdt}} };

    } else if (rptype === 'opt2'){
        match = { "$match": { userid:uid, maindate:{$gte: fromdt, $lte: todt}} };
    } else {
        match = { "$match": { userid:uid } };
    }
    
       
}

exports.mainreport = function(req, res, next){
    const uid = req.params.id || req.query.uname;
    const rptype = req.body.report || req.query.report;
    const from_dt = req.body.startdt || req.query.startdt;
    const to_dt = req.body.enddt || req.query.enddt;
    const fromdt = new Date(from_dt);
    const todt = new Date(to_dt);

    let limit = parseInt(req.query.limit);
    let page = parseInt(req.body.page || req.query.page);
    let sortby = req.body.sortby || req.query.sortby;
    let query = {};

    if(!limit || limit < 1) {
	limit = 10;
    }

    if(!page || page < 1) {
	page = 1;
    }

    if(!sortby) {
	sortby = 'maindate';
    }

    var offset = (page - 1) * limit;

    if (!uid || !rptype) {
        return res.status(422).send({ error: 'Posted data is not correct or incompleted.'});
	}else if(rptype === 'opt2' && !fromdt && !todt){
		return res.status(422).send({ error: 'From or To date missing.'});
	}else if(fromdt > todt){   
		 return res.status(422).send({ error: 'From date cannot be greater than To date.'});
	}else{

		if(rptype === 'opt1'){
			// returns records for the current month
			let oDt = new Date();
			let month = oDt.getUTCMonth() + 1; //months from 1-12
			let year = oDt.getUTCFullYear();

			let fdt = new Date(year + "/" + month + "/1");
			let tdt = new Date(year + "/" + month + "/31");
	
			query = { userid:uid, maindate:{$gte: fdt, $lte: tdt} };

			Main.count(query, function(err, count){
				if(count > offset){
					offset = 0;
				}
			});

		} else if (rptype === 'opt2'){
			// return records within given date range
			query = { userid:uid, maindate:{$gte: fromdt, $lte: todt} };

			Main.count(query, function(err, count){
				if(count > offset){
					offset = 0;
				}
			});

		} else {
			// returns all maintenance records for the user
			query = { userid:uid };

			Main.count(query, function(err, count){
				if(count > offset){
					offset = 0;
				}
			});
		}

		var options = {
			select: 'maindate maintool ticketid maindesc maintech',
			sort: sortby,
			offset: offset,
			limit: limit
		}

		Main.paginate(query, options).then(function(result) {
			res.status(201).json({
				success: true, 
				data: result
			});
		});
	}
}

/*exports.waitingtime =  function(req, res, next){
	var start = maindate(),
		end = rsdate(),
		diff = 0,
		days = 100 * 60 * 60 * 24;
		
}
*/
