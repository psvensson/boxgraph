dojo.provide("drawutil.test.testBezier");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");

dojo.require("dojox.gfx");


dojo.declare("drawutil.test.testBezier", [	dijit._Widget, dijit._Templated  ],
{
	templatePath			: dojo.moduleUrl("drawutil.test", "testBezier.html"),
	widgetsInTemplate	: true,
	color							:	"#7ad",
	numpixels					: 30,
	
	postCreate: function()
	{
		this.inherited(arguments);
		console.log("postCreate in testBezier called");
		this.surface = dojox.gfx.createSurface(this.canvas, 400, 400);

		//setTimeout(dojo.hitch(this, doCurve),20);

		this.testDraw();
	},

	testDraw: function()
	{
		//Control Points
		B1 = {x:50, y:50};
		B2 = {x:300,y:50};
		B3 = {x:50, y:300};
		B4 = {x:300, y:300};
		var points = [];
		for(var i = 0; i < this.numpixels; i++)
		{
			points[i] = this.surface.createCircle({cx:100, cy:10*i, r:3}).setFill(this.color);
		}

		this.drawBezier(B1, B2, B3, B4, this.numpixels, points);

	},

	doCurve: function()
	{
		this.circle = this.surface.createCircle({cx:100, cy:100, r:5}).setFill("#2f5");

		//Control Points
		P1 = {x:50, y:50};
		P2 = {x:300,y:50};
		P3 = {x:50, y:300};
		P4 = {x:300, y:300};

		stage=0;
		dir=0;
		//change direction of motion at each end of the curve
		if(stage>1) dir=1;
		if(stage<0) dir=0;

		//increment to next step
		if(dir==0) stage+=0.01;
		else stage-=0.01;

		//find position on bezier curve
		var curpos = this.getBezierFor(stage,P1,P2,P3,P4);
		var y = Math.round(curpos.y);
		var x = Math.round(curpos.x);

		this.circle.setTransform({x: x, y: y});

	},
    
    getBezierFor: function(percent, C1, C2, C3, C4)
	{
		//====================================\\
		// 13thParallel.org Beziér Curve Code \\
		//   by Dan Pupius (www.pupius.net)   \\
		//====================================\\


		function B1(t) { return t*t*t }
		function B2(t) { return 3*t*t*(1-t) }
		function B3(t) { return 3*t*(1-t)*(1-t) }
		function B4(t) { return (1-t)*(1-t)*(1-t) }	

		var pos = {x:0, y:0};
		pos.x = C1.x*B1(percent) + C2.x*B2(percent) + C3.x*B3(percent) + C4.x*B4(percent);
		pos.y = C1.y*B1(percent) + C2.y*B2(percent) + C3.y*B3(percent) + C4.y*B4(percent);
		return pos;

	},

	drawBezier: function(C1, C2, C3, C4, numPixels, objs)
	{
		for(var i=0; i<numPixels; i++)
		{				
			percent = (1/numPixels) * i;
			var pos = this.getBezierFor(percent, C1, C2, C3, C4);
			var x = parseInt(pos.x);
			var y = parseInt(pos.y);
			console.log(" transforming "+objs[i]+" to "+x+", "+y);
			objs[i].setTransform([dojox.gfx.matrix.translate(x, y)]);
		}
	}


});