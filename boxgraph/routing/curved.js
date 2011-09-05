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

		drawLine: function(llorig, surface)
		{
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
			var ll = this.expandLine(llorig);
			console.log("curved expanded line is..");
			console.dir(ll);
			var q =	25;
			//return surface.createPolyline(ll);
			var path = surface.createPath();
			var first = ll[0];
			var second = ll[1];
			var third = ll[2];
			var num = 0;

			path.moveTo(first.x, first.y);
			path.lineTo(second.x, second.y);
			
			//path.qCurveTo(c.x+qx, c.y+qy, p.x, p.y);
			this.addText(surface, first.x+10, first.y+10, num++);
			var stroke = "Solid"

			for(var i = 2; i < ll.length; i+=2)
			{
				var c = ll[i];
				var p = ll[i+1];
				//var s = ll[i+1];
				var qx = 0;
				var qy = 0;
				if(p)
				{
					//path.qCurveTo(c.x+qx, c.y+qy, p.x, p.y).setStroke({style: stroke, color: "black"});
					
					path.qCurveTo(c.x+qx, c.y+qy, p.x, p.y);

					this.circles.push(surface.createCircle({cx: c.x, cy: c.y, r:3}).setStroke({color: [255, 0, 0, 1.0], width: 1 }));
					this.addText(surface, c.x+5, c.y+5, num++);
					this.circles.push(surface.createCircle({cx: p.x, cy: p.y, r:3}).setStroke({color: [0, 155, 155, 1.0], width: 1 }));
					this.addText(surface, p.x+5, p.y+5, num++);
					q = -q;
					stroke = stroke == "Solid" ? "ShortDash" : "Solid";
				}
				else
				{
					path.qCurveTo(c.x+qx, c.y+qy, c.x, c.y);
				}
			}
			return path;
		},

		addText: function(surface, x, y, text)
		{
			this.circles.push(surface.createText({text: text, x: x, y: y}).setFill("black"));
		},

		// Add an extra point between each point so the bézier can 'curve' between the new extra points using the old points as offsets
		expandLine: function(ll)
		{
			var rv = [];
			var dir = 1;
			var p = null;
			rv.push(ll[0]);
			for(var i = 2; i < ll.length; i++)
			{
				var oldp = ll[i-1];
				p = ll[i];
				rv.push(oldp);
				var newp = {};
				if(oldp.x == p.x)
				{
					q = (oldp.y - p.y)/6 * dir;
					newp.x = parseInt(oldp.x - q, 10);
					newp.y = oldp.y;
				}
				else
				{
					q = (oldp.x - p.x)/2 * dir;
					newp.y = parseInt(oldp.y - q, 10);
					newp.x = oldp.x;
				}
				rv.push(newp);
				//dir = -dir;
			}
			rv.push(p);
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
