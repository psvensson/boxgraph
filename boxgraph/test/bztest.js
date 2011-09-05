dojo.provide("boxgraph.test.bztest");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dojox.gfx");


dojo.declare("boxgraph.test.bztest", [	dijit._Widget, dijit._Templated ],
{
	templatePath			: dojo.moduleUrl("boxgraph.test", "bztest.html"),
	widgetsInTemplate		: true,
	form								: "",

	constructor: function()
	{
		this.inherited(arguments);
	},

	postCreate: function()
	{
		this.inherited(arguments);
		this.reload();
	},

	reload: function()
	{
		// clear canvas
		if(this.surface)
		{
			this.surface.clear();
		}
		else
		{
			this.surface = dojox.gfx.createSurface(this.canvas, 500, 300);
		}
		// Read points from form
		var vals = this.form.get('value');
		console.log("got point values from form..");
		console.dir(vals);
		var points = [];
		for(var i in vals)
		{
			var val = vals[i];
			console.log("parsing "+val);
			var varr = val.split(",");
			points.push({x: parseInt(varr[0], 10), y: parseInt(varr[1], 10)});
		}
		console.log("points created from values are ..");
		console.dir(points);
		// Draw lines + béziers
		var path = this.surface.createPath();
		var bpath = this.surface.createPath();

		var p0 = points[0];
		var p1 = points[1];
		var p2 = points[2];
		var p3 = points[3];
		var p4 = points[4];

		path.moveTo(points[0]);
		path.lineTo(points[1]);
		this.surface.createCircle({cx: points[1].x, cy: points[1].y, r:5}).setStroke({color: [0, 0, 255, 1.0], width: 2 });
		path.lineTo(points[2]);
		this.surface.createCircle({cx: points[2].x, cy: points[2].y, r:5}).setStroke({color: [0, 255, 0, 1.0], width: 2 });
		path.lineTo(points[3]);
		this.surface.createCircle({cx: points[3].x, cy: points[3].y, r:5}).setStroke({color: [255, 0, 0, 1.0], width: 2 });
		path.lineTo(points[4]);

		bpath.moveTo(points[0]);
		bpath.qCurveTo(p1.x+0, p1.y-50, p2);
		//bpath.qCurveTo(p1.x+0, p1.y+50, p2);
		bpath.qCurveTo(p3.x-0, p3.y+50, p4);

		path.setStroke({color: "black", width: 2 });
		bpath.setStroke({color: "red", width: 2 });
	}

});