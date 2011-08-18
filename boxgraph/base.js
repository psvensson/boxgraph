dojo.provide("boxgraph.base");

dojo.declare("boxgraph.base", null,
{
	
    model       : "", // The model containinb properties for the things being drawn
    // Minimum model properties are; {x:0 , y:0, height: 100, width: 100}  .
   
    
    constructor: function(args)
    {
        try
        {
        this.model = args.model;
        this.surface = args.surface;
        }
        catch(e)
        {
         console.log("WTF!!!! ** trying to create box without arguments eh??!! : "+e);
         throw("WTF!!");
        }
    },
    
    /*
    The p argument is an object literal which looks like this;
    {
        ratio: 10,
        where: "xxxx"
    }
    
    The where property is a cue for the respective entity where to put the port, like "right" for the right side of a rectangular block
    The ratio property tells how far out from 'where' the port is to be placed.
    */
    addPort: function(p)
    {
        this.ports.push(p);
    },
    
    removePort: function(p)
    {
        
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