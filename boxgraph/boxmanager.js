dojo.provide("boxgraph.boxmanager");

dojo.require("dojox.gfx");
dojo.require("dojox.gfx.move");

dojo.declare("boxgraph.boxmanager", null, {
		boxes:			[],
		xlist:			[],
		ylist:			[],
		margin:		 20, // Margin in Canvas px that we want a gap between boxes to have
		intersectpadding: 0,
	ports:				[],

		constructor: function()
		{
			this.boxes = [];
			this.xlist = [];
			this.ylist = [];

			dojo.subscribe("boxgraph_redraw", dojo.hitch(this, function()
			{
				dojo.forEach(this.boxes, function(box)
				{
					box.renderPorts();
				});
			}));
		},

	getPortById: function(id)
	{
		var box = this.ports[id];
		return box.getPortById(id);
	},

		addPort: function(box, port)
		{
			this.ports[port.id] = box;
			box.addPort(port);
		},

		addBox: function(newbox)
		{
			this.boxes.push(newbox);

			// Make sure we create ordered list for x and y coordinates, so we quickly can iterate from low to high
			var xindex = 0;
			if (this.xlist.length === 0)
			{
				this.xlist.push(newbox);
				this.ylist.push(newbox);
			}
			else
			{
				for (var x = 0; x < this.xlist.length; x++)
				{
					var xbox = this.xlist[x];
					if (xbox.model.x > newbox.model.x)
					{
						xindex = x;
						break;
					}
				}
				this.xlist.splice(xindex, 0, newbox);
				var yindex = 0;
				for (var y = 0; y < this.ylist.length; y++)
				{
					var ybox = this.ylist[y];
					if (ybox.model.y > newbox.model.y)
					{
						yindex = y;
						break;
					}
				}
				this.ylist.splice(yindex, 0, newbox);
			}
		},

		getBoxes: function()
		{
			return this.boxes;
		},

		// dir is direction, which also defines which axis we're interested in.
		// From the startingpoints relevant axis (defined by dir) we see if the destination point axis is not within any boxes
		// If the destination axis point (e.g. dest.x for left or right) is within a box, then we give the margin axis point before
		// that box and return, but make sure to change dir on the returned point so it strives towards the other axis, as we've now
		// exhausted or potential on the axis of the current one.
		//
		// The use of axis here can mean 'x' or 'y' depending on direcitons, this also relates to the lenght and otherlength properties which are 'length' and 'width' of a box depending again on direction
		// This makes the method harder to read, I guess, but more DRY and versatile. YMMV.
		getGoodPointFor: function(start, destination)
		{
			var dest = this.getPaddingFor(destination);
			var rv = {x: -1, y: -1, dir: "whatever"};
			var dir = start.dir;
			if (dir == -1)
			{
				throw("''''' ARGH!! '''' No dir defined fo start in getGoodPointFor");
			}

			var list = (dir == "up" || dir == "down") ? this.ylist : this.xlist;

			var axis = (dir == "up" || dir == "down") ? "y" : "x"; // If we get a point which is pointing towards left or right we should go up or down, and the other way around.
			var otheraxis = axis == "x" ? "y" : "x";

			var length = (dir == "up" || dir == "down") ? "height" : "width";
			var otherlength = (dir == "up" || dir == "down") ? "width" : "height";

			var target = {};

			target[otheraxis] = dest[otheraxis];
			target[axis] = start[axis];
			//console.log("++++++++++++++++++++++++ getGoodPointFor -- dir = " + dir + ",  start[" + axis + "] = " + start[axis] + ", start[" + otheraxis + "] = " + start[otheraxis] + ", target[" + axis + "] = " + target[axis] + ", target[" + otheraxis + "] = " + target[otheraxis]);
			// Now we have a target point

			// We want to get from start[axis] to target[axis], e.g. start.x to target.x
			// We need to see if there are any boxes which block the way to dest[axis] and end the chase there.

			rv = target; // default
			var collissions = []; // Could be more than one

			if (start.collidedwith)
			{
				// We collided with a box last point. This point must find a way to clear the box.
				// The collission occured because our target was behind the box, somwhere. That means we must move sideways.
				// If the start point direction is up, we must go either left or right (with margin) to clear the box.
				var collidedwith = start.collidedwith.model;
				//console.log("last point was a collision with ");
				//console.dir(collidedwith);
				//console.log("collission.dir = " + start.dir);
				var midx = collidedwith.x + collidedwith.width / 2;
				var midy = collidedwith.y + collidedwith.height / 2;
				//console.log("midx = " + midx + ", midy = " + midy);
				switch (start.dir)
				{
				case "up":
				case "down":
					rv.x = parseInt(rv.x < midx ? collidedwith.x - 30 : collidedwith.x + collidedwith.width + 30);
					rv.y = start.y;
					break;
				case "right":
				case "left":
					rv.x = start.x;
					rv.y = parseInt(rv.y < midy ? collidedwith.y - 30 : collidedwith.y + collidedwith.height + 30);
					break;
				}
				delete start.collidedwith;
			}
			else
			{
				for (var i = 0; i < list.length; i++)
				{
					try
					{
						//console.log("+++++++++++++++++++++++ checking box "+i+" of "+list.length);
						var box = list[i];
						var collision = this.intersectBox(start, target, box.model);
						if (collision.x)
						{
							//console.dir(collision);
							collissions.push({collision: collision, box: box});
							//console.log("      Collission detected...");
							//break;
						}
					}
					catch(e)
					{
						console.log("ERROR**** " + e);
					}
				}
				// Sort all collisions so that we only cater for the nearest one!
				if (collissions.length > 0)
				{
					//console.log("collissions are..");
					//console.dir(collissions);
					collissions.sort(function(a, b)
					{
						var rv = 0;
						var da = Math.abs(start.x - a.x + start.y - a.y);
						var db = Math.abs(start.y - b.y + start.y - b.y);
						if (da < db)
						{
							rv = -1;
						}
						if (da > db)
						{
							rv = -1;
						}
						return rv;
					});
					var nearest = collissions.pop();
					//console.log(" --- chose box '" + nearest.box.name + "' as closest collission");
					rv = nearest.collision;
					rv.collidedwith = nearest.box;
				}
			}
			//rv.dir = start.dir;
			rv.dir = start.dir;
			//console.log("+++ getGoodPointFor returning x: " + rv.x + ", y: " + rv.y + ", dir: " + rv.dir);
			return rv;
		},

		getPaddingFor: function(point)
		{
			var rv = {x: point.x, y: point.y, dir: point.dir};
			switch (point.dir)
			{
			case "up":
				rv.y -= this.margin;
				break;
			case "down":
				rv.y += this.margin;
				break;
			case "right":
				rv.x += this.margin;
				break;
			case "left":
				rv.x -= this.margin;
				break;
			}
			return rv;
		},

		ccw: function(A, B, C)
		{
			return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
		},

		intersect: function(A, B, C, D)
		{
			var rv = this.ccw(A, C, D) != this.ccw(B, C, D) && this.ccw(A, B, C) != this.ccw(A, B, D);
			//console.log("intersect says "+rv);
			return rv;
		},

		intersectBox: function(a, b, box)
		{
			var boxnw = {x: box.x - this.intersectpadding, y: box.y - this.intersectpadding};
			var boxne = {x: box.x + box.width + this.intersectpadding, y: box.y + this.intersectpadding};
			var boxsw = {x: box.x - this.intersectpadding, y: box.y + box.height + this.intersectpadding};
			var boxse = {x: box.x + box.width + this.intersectpadding, y: box.y + box.height + this.intersectpadding};

			var adiffx = Math.abs(a.x - b.x);
			var adiffy = Math.abs(a.y - b.y);

			var xdir = a.x < b.x ? "right" : "left";
			var ydir = a.y < b.y ? "down" : "up";

			var dir = (adiffx > adiffy) ? xdir : ydir;

			//console.log("  intersectBox calculated direction "+a.x+","+a.y+" -> "+b.x+","+b.y+" is '"+dir+"' because addiffx "+adiffx+" > adiffy "+adiffy+" (adiffx > adiffy) == "+(adiffx > adiffy));
			var rv = {};
			var intup = false, intdown = false, intright = false, intleft = false;

			// upper line of box
			if (this.intersect(a, b, boxnw, boxne) && dir == "down")
			{
				console.log("    intersected upper side of box '" + box.name + "' {x: " + box.x + ", y: " + box.y + ", width: " + box.width + ", height: " + box.height + "}");
				intup = true;
			}
			// lower line of box
			if (this.intersect(a, b, boxsw, boxse) && dir == "up")
			{
				console.log("    intersected lower side of box '" + box.name + "' {x: " + box.x + ", y: " + box.y + ", width: " + box.width + ", height: " + box.height + "}");
				intdown = true;
			}
			// left line of box
			if (this.intersect(a, b, boxnw, boxsw) && dir == "right")
			{
				console.log("    intersected left side of box '" + box.name + "' {x: " + box.x + ", y: " + box.y + ", width: " + box.width + ", height: " + box.height + "}");
				intleft = true;
			}
			// right line of box
			else
			{
				if (this.intersect(a, b, boxne, boxse) && dir == "left")
				{
					console.log("    intersected right side of box '" + box.name + "' {x: " + box.x + ", y: " + box.y + ", width: " + box.width + ", height: " + box.height + "}");
					intright = true;
				}
			}

			//------------------------------------------------

			if (intup)
			{
				rv.x = a.x;
				rv.y = box.y - this.margin;
			}
			if (intdown)
			{
				rv.x = a.x;
				rv.y = box.y + box.height + this.margin;
			}
			if (intleft)
			{
				rv.x = box.x - this.margin;
				rv.y = a.y;
			}
			if (intright)
			{
				rv.x = box.x + box.width + this.margin;
				rv.y = a.y;
			}
			return rv;
		}
	});