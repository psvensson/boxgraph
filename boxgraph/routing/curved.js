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

		drawLine: function(ll, surface)
		{
			var q = 5;
			//return surface.createPolyline(ll);
			var path = surface.createPath();
			var first = ll[0];
			var second = ll[1];
			var third = ll[2];
			path.moveTo(first.x, first.y);
			//var mx = (second.x + first.x / 2) - second.x;
			//var my = (second.y + first.y / 2) - second.x;
			//path.curveTo(mx+q, my-q, mx-q, my+q, second.x, second.y);
			//var oldx = first.x;
			//var oldy = first.y;
			//path.qCurveTo(second.x, second.y, third.x, third.y);
			for(var i = 1; i < ll.length; i+=1)
			{
				//var c = ll[i-1];
				var p = ll[i];
				var s = ll[i+1];
				//console.log("step "+i+" -> c="+c+", p="+p+", s="+s);
				//var midx = p.x+15;
				//var midy = p.y;
				//mx = (p.x + c.x / 2) ;
				//my = (p.y + c.y / 2) ;
				//path.qSmoothCurveTo(p.x, p.y);
				if(!s)
				{
					path.qCurveTo(p.x-20, p.y-10, p.x, p.y);
				}
				else
				{
					path.qCurveTo(p.x+20, p.y+20, s.x, s.y);
					//path.qSmoothCurveTo(p.x, p.y);
					//path.curveTo(c.x+20, c.y+20, p.x-20, p.y-20, s.x, s.y);
				}

				//path.curveTo(mx+q, my-q, mx-q, my+q, p.x, p.y);
				//oldx = p.x;
				//oldy = p.y;
				//path.qSmoothCurveTo(p.x, p.y);


			}


			return path;
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
