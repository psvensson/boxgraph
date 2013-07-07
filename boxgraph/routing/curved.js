define(
    [
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",

        "dojo/dom-style",
        "dojo/_base/fx",
        "dojo/_base/lang",
        "dojox/gfx",
        "boxgraph/port",
        "boxgraph/portmanager",
        "boxgraph/boxmanager",
        "boxgraph/base",
        "dojo/on",
        "boxgraph/routing/manhattan2",
        "dojo/_base/array"
    ],
    function(declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
             domStyle, baseFx, lang, gfx, port, portmanager, boxmanager,
             base, on, manhattan2, array)
    {
        return declare([],
            {


        boxmanager:     "",
        sanitycheck:    8,
        tension:        2,
	
        constructor: function(args)
        {
            this.boxmanager = args.boxmanager;
        },

		drawLine: function(llorig, surface, fp, sp)
		{
			console.log("drawLine, fp="+fp+", sp="+sp+" surface = "+surface);
			if(this.circles)
			{
				array.forEach(this.circles, function(circle)
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
            var path = "";
            try
            {
                if(typeof ll === "string")
                {
                    path = this.drawSplineString(surface, ll);
                }
                else
                {
                    path = this.drawArraySegments(surface, ll);
                }
            }
            catch(e)
            {
                console.log("ERROORRRRRRRÖ "+e);    
            }
			return path;
		},

        drawSplineString: function(surface, ll)
        {
            surface.createPath(ll).setStroke({width:1, color:"#4090b1" });
        },

        drawArraySegments: function(surface, ll)
        {
            var q =	25;
            //return surface.createPolyline(ll);
            console.log("drawArraySegments called.");
            console.dir(ll);

            var stroke = "Solid";
            stroke = stroke == "Solid" ? "ShortDash" : "Solid";
            var path = surface.createPath().setStroke({style: stroke,
                color: "red"});

            var p1 = ll.shift();
            var p2 = ll.shift();
            var p3 = ll.shift();
            var p4 = ll.shift();

            var num = 0;
            console.log("starting to draw bezier points..");
            while(ll.length > 0)
            {
                //var s = ll[i+1];
                console.log("  drawing from point "+p1.x+","+p1.y);
                //path.qCurveTo(c.x+qx, c.y+qy, p.x, p.y).
                // setStroke({style: stroke, color: "black"});
                path.moveTo(p1.x, p1.y);
                path.curveTo(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y)
                    .setStroke({style: stroke, color: "red"});
                //path.qCurveTo(first.x, first.y, second.x, second.y)
                // .setStroke({style: stroke, color: "black"});
/*
                this.circles.push(surface.createCircle(
                {cx: p1.x, cy: p1.y, r:3}).setStroke(
                {color: [0, 255, 0, 1.0], width: 1 }));
                this.addText(surface, p1.x+5, p1.y, num++);
                this.circles.push(surface.createCircle(
                {cx: p2.x, cy: p2.y, r:3}).setStroke(
                {color: [0, 55, 255, 1.0], width: 1 }));
                this.addText(surface, p2.x+5, p2.y, num++);
                this.circles.push(surface.createCircle(
                {cx: p3.x, cy: p3.y, r:3}).setStroke(
                {color: [0, 55, 255, 1.0], width: 1 }));
                this.addText(surface, p3.x+5, p3.y, num++);
*/
                p1 = p4;
                var p2 = ll.shift();
                var p3 = ll.shift();
                var p4 = ll.shift();
            }
            return path;
        },

		addText: function(surface, x, y, text)
		{
			this.circles.push(surface.createText(
                {text: text, x: x, y: y}).setFill("black"));
		},

		// Add an extra point between each point so the bézier can
		// 'curve' between the new extra points using the old points as offsets
		expandLine: function(ll, fp, sp)
		{
            var xll = [];
            var flip = 1;
            xll.push(ll[0]);
            for(var x = 1; x < ll.length-1; x++)
            {
                var midx = parseInt( (ll[x].x - ll[x-1].x) / 2 );
                var midy = parseInt( (ll[x].y - ll[x-1].y) / 2 );

                if(ll[x].x === ll[x-1].x)
                {
                    xll.push( {x: ll[x-1].x + (flip * 20),
                        y: ll[x-1].y + midy } );
                }
                else
                {
                    xll.push( {x: ll[x-1].x + midx,
                        y: ll[x-1].y - (flip * 20) } );
                }

                flip = flip === 1 ? -1 : 1;
                xll.push(ll[x]);

            }
            xll.push(ll[ll.length-1]);
            xll.push(sp);

            return this.toPath(xll);
		},


		drawShadowLine: function(ll, surface)
		{
			return surface.createPolyline(ll);
			//return this.drawLine(ll, surface);
		},

        toPath: function(points)
        {
            //points.pop();
            var patharr = [];
            // set tension

            var fact = 1;
            // declare vars
            var dx, c0x, c1x, addx, addy, dy, c0y, c1y;
            // move to first point
            var path = "M"+points[0].x+","+points[0].y;

            patharr.push({x:points[0].x, y: points[0].y});

            var sw = 1;
            for(var i = 1; i < points.length; i++)
            {
                var p1 = points[i-1];
                var p2 = points[i];

                dx = p2.x - p1.x;
                addx = parseInt(dx / this.tension);

                dy = p2.y - p1.y;
                addy = parseInt(dy / this.tension);

                console.log(p1.x+", "+p1.y+" addx - "+addx+" addy - "+addy);

                if(sw === 1)
                {
                    c1y = p1.y ;
                    c0y = p2.y   ;
                    c0x = p1.x + (sw * addx * fact);
                    c1x = p2.x   - (sw * addx * fact);
                }
                else
                {
                    c1x = p1.x ;
                    c0x = p2.x   ;
                    c0y = p1.y - (sw * addy* fact);
                    c1y = p2.y   + (sw * addy * fact);
                }
                // append control points and next point
                path += " C"+c0x+","+c0y+" "+c1x+", "+c1y+" "+points[i].x
                    +","+points[i].y;

                patharr.push({x:c0x, y: c0y});
                patharr.push({x:c1x, y: c1y});
                patharr.push({x:points[i].x, y: points[i].y});

                sw = sw === 1 ? -1 : 1;

            }
            //return path;
            console.log("toPath returning patharr..");
            console.dir(patharr);
            return patharr;
        },

        createSplineSegmentFor: function(n, n1)
        {
            /*


             Figure out the X difference (dx) between each pair of
              points on our line
             Set the x of the first control point to be x0 +
              (dx/tension), and y to be y0
             Set the x of the second control point to be x1 –
              (dx/tension), and y to be y1
             Set the end of the path segment to be x1, y1


https://www.sitepen.com/blog/2007/07/16/softening-polylines-with-dojox-graphics


            dx=(171-98);
            add=dx/tension;
            control0x=98+add;
            control1x=171-add;
            pathdata += " C"+control0x +",124 "+control1x+",137 171,137";
            */

            var dx = n1.x - n.x;
            var dy = n1.y - n.y;

            //var cp0 = { x: n.x + parseInt(dx / this.tension), y: n.y +
            // parseInt(dy / this.tension)};
            //var cp1 = { x: n1.x - parseInt(dx / this.tension), y: n1.y -
            // parseInt(dy / this.tension)};
            var cp0 = { x: parseInt((n.x + n1.x) / 2), y: n.y };
            var cp1 = { x: n1.x - parseInt(dx / this.tension), y: n1.y };

            return "M"+ n.x+","+ n.y+" C"+cp0.x+","+cp0.y+" "+cp1.x+","+
                cp1.y+" "+n1.x+","+n1.y;

        },

		getRouting: function(fp, secondport)
        {
            console.log("--- Curved getRouting called.");
            var sp = {x: secondport.x+5 , y: secondport.y+5,
                dir: secondport.dir};
            //sp = this.boxmanager.getPaddingFor(sp);
            console.dir({fp: fp, sp: sp});
            var nextpoint = { x: fp.x + 5, y: fp.y + 5, dir: fp.dir };
            var rv = [nextpoint]; // Returns an array of {x:0, y:0}
            // objects, beginning at fp
            nextpoint = this.boxmanager.getPaddingFor(nextpoint);
            rv.push(nextpoint);
            var count = 0;
            var absx = 100, absy = 100;
            while(!(absx < 21 && absy < 21 )) // Loop until the next
            // point _is_ our destination
            {
                if(count++ > this.sanitycheck)
                {
                    console.log("*** Sanity Check Fault. More than "+
                        this.sanitycheck+
                        " while loops to get points for route!");
                    break;
                }
                //var dir = this.getDirection(nextpoint, sp);
                // If sp.x > fp.x and fp is located 'up',
                // then direction is left
                //nextpoint.dir = dir;
                //console.log("Calling getNextGoodPoint for...");
                console.dir({fp: nextpoint, sp: sp});
                nextpoint = this.getNextPoint(nextpoint, sp);

                absx = Math.abs(nextpoint.x - sp.x);
                absy = Math.abs(nextpoint.y - sp.y);
                //console.log("getRouting nextpoint.x = "+nextpoint.x+
                // ", nextpoint.y = "+nextpoint.y+", sp.x = "+sp.x+
                // ", sp.y = "
                // +sp.y+", dir = '"+nextpoint.dir+"', absx = "+absx+
                // ", absy = "+absy);
                rv.push(nextpoint);
            }
            console.log("+++ getRouting while loop done. nextpoint.x = "+
                nextpoint.x+", nextpoint.y = "+nextpoint.y+", sp.x = "
                +sp.x+", sp.y = "+sp.y);
            rv.push(nextpoint); // And add that as well. We're home.
            // Push last point
            rv.push({ x: sp.x , y: sp.y , dir: sp.dir });
            return rv;
        }

})
    })
