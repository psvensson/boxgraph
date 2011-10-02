dojo.provide("boxgraph.routing.curved");

dojo.require("boxgraph.routing.manhattan2");

dojo.declare("boxgraph.routing.curved", boxgraph.routing.manhattan2,
{

	boxmanager:     "",
    sanitycheck:    8,
	
	 constructor: function(args)
    {
        this.boxmanager = args.boxmanager;
    },

		drawLine: function(llorig, surface, fp, sp)
		{
			console.log("drawLine, fp="+fp+", sp="+sp);
			if(this.circles)
			{
				dojo.forEach(this.circles, function(circle)
				{
					surface.remove(circle);
				})
			}
			else
			{
				this.circles = [];
			}
			console.log("curved orig line is..");
			console.dir(llorig);
			var ll = this.expandLine(llorig, fp, sp);
			console.log("curved expanded line is..");
			console.dir(ll);
            try
            {
			var q =	25;
			//return surface.createPolyline(ll);
            
			var path = surface.createPath();
            
			var first = ll[0];
			var second = ll[1];
			var third = ll[2];
			var num = 0;
            
			path.moveTo(first.x, first.y);
            
			this.addText(surface, first.x+10, first.y+10, num++);
            
			path.lineTo(second.x, second.y);
            
			this.addText(surface, second.x+10, second.y+10, num++);
			//path.qCurveTo(c.x+qx, c.y+qy, p.x, p.y);
			var stroke = "Solid"
            //console.log("starting to compute new points..");
			for(var i = 2; i < ll.length; i+=2)
			{
				var c = ll[i];
				var p = ll[i+1];
				//var s = ll[i+1];
                //console.log("  drawing from point "+c);
				if(p)
				{
					//path.qCurveTo(c.x+qx, c.y+qy, p.x, p.y).setStroke({style: stroke, color: "black"});
					path.qCurveTo(c.x, c.y, p.x, p.y);

					this.circles.push(surface.createCircle({cx: c.x, cy: c.y, r:3}).setStroke({color: [0, 255, 0, 1.0], width: 1 }));
					this.addText(surface, c.x+5, c.y+5, num++);
					this.circles.push(surface.createCircle({cx: p.x, cy: p.y, r:3}).setStroke({color: [0, 55, 255, 1.0], width: 1 }));
					this.addText(surface, p.x+5, p.y+5, num++);
					q = -q;
					stroke = stroke == "Solid" ? "ShortDash" : "Solid";
				}
				else
				{
					path.qCurveTo(c.x, c.y, sp.x, sp.y); // Just go to second point, we're nearly there anyway
				}
			}
            }
            catch(e)
            {
                console.log("ERROORRRRRRRÖ "+e);    
            }
			return path;
		},

		addText: function(surface, x, y, text)
		{
			this.circles.push(surface.createText({text: text, x: x, y: y}).setFill("black"));
		},

		// Add an extra point between each point so the bézier can 'curve' between the new extra points using the old points as offsets
		expandLine: function(ll, fp, sp)
		{
			var rv = [];
			//var uddir = (fp.dir == "up" 	|| fp.dir == "down") ? 1 : -1;
			//var lrdir = (fp.dir == "right" 	|| fp.dir == "left") ? 1 : -1;
            var uddir = ll[0].y > sp.x ? -1 : 1;
            var lrdir = ll[0].x > sp.y ? -1 : 1;
			var p = null;
			// First push the first point
			rv.push(ll[0]);

			for(var i = 1; i < ll.length; i++)
			{
				var oldp = ll[i-1];
				p = ll[i];
                var q = 0;

				var newp = {};
                
                var turnx = oldp.x - p.x;
                var turny = oldp.y - p.y; 
                
				if(oldp.x == p.x)
				{
					q = parseInt(Math.abs(turny / 2) * uddir, 10);
					newp.x = oldp.x;
					newp.y = oldp.y + q;
					//uddir = -uddir;
                    uddir = p.y > sp.y ? -1 : 1;
				}
				else
				{
					q = parseInt(Math.abs(turnx / 2)  * lrdir, 10);
					newp.y = oldp.y ;
					newp.x = oldp.x + q;
					//lrdir = -lrdir;
                    lrdir = p.x > sp.x > 0 ? -1 : 1;
				}

				rv.push(newp); // Add new point halfway between last point and old point
				rv.push(p); // USe old next point as control point (bézier attractor)

			}
			//rv.push(p);
			return rv;
		},


		drawShadowLine: function(ll, surface)
		{
			return surface.createPolyline(ll);
			//return this.drawLine(ll, surface);
		},

		getRouting: function(fp, secondport)
    {
        console.log("--- Curved getRouting called.");
        var sp = {x: secondport.x+5 , y: secondport.y+5, dir: secondport.dir};
        //sp = this.boxmanager.getPaddingFor(sp);
        console.dir({fp: fp, sp: sp});
        var nextpoint = { x: fp.x + 5, y: fp.y + 5, dir: fp.dir };
        var rv = [nextpoint]; // Returns an array of {x:0, y:0} objects, beginning at fp
        nextpoint = this.boxmanager.getPaddingFor(nextpoint);
        rv.push(nextpoint);
        var count = 0;
        var absx = 100, absy = 100;
        while(!(absx < 21 && absy < 21 )) // Loop until the next point _is_ our destination
        {
            if(count++ > this.sanitycheck)
            {
                console.log("*** Sanity Check Fault. More than "+this.sanitycheck+" while loops to get points for route!");
                break;
            }
            //var dir = this.getDirection(nextpoint, sp); // If sp.x > fp.x and fp is located 'up', then direction is left
            //nextpoint.dir = dir;
            //console.log("Calling getNextGoodPoint for...");
            console.dir({fp: nextpoint, sp: sp});
            nextpoint = this.getNextPoint(nextpoint, sp);

            absx = Math.abs(nextpoint.x - sp.x);
            absy = Math.abs(nextpoint.y - sp.y);
            //console.log("getRouting nextpoint.x = "+nextpoint.x+", nextpoint.y = "+nextpoint.y+", sp.x = "+sp.x+", sp.y = "+sp.y+", dir = '"+nextpoint.dir+"', absx = "+absx+", absy = "+absy);
            rv.push(nextpoint);
        }
        console.log("+++ getRouting while loop done. nextpoint.x = "+nextpoint.x+", nextpoint.y = "+nextpoint.y+", sp.x = "+sp.x+", sp.y = "+sp.y);
        rv.push(nextpoint); // And add that as well. We're home.
        // Push last point
        rv.push({ x: sp.x , y: sp.y , dir: sp.dir });
        return rv;
	}

});
