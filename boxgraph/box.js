define(
    [
        "dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_WidgetsInTemplateMixin",
        "dojo/text!./editor.html",
        "dojo/dom-style",
        "dojo/_base/fx",
        "dojo/_base/lang",
        "dojox/gfx",
        "dojox/gfx/Moveable",
        "boxgraph/port",
        "boxgraph/portmanager",
        "boxgraph/boxmanager",
        "boxgraph/base",
        "dojo/on",
        "dojo/_base/connect"
    ],
    function(declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
             template, domStyle, baseFx, lang, gfx, gfxmoveable, bport,
             portmanager, boxmanager, base, on, connect)
    {
        return declare([base],
        {

    surface                 : "",
    name                    : "",
    ports                   : [],
    
    constructor: function(args)
    {
        //console.log("boxgraph.box constructor");
        this.inherited(arguments);
        this.ports = [];
        //console.log("boxgraph.box constructor. this.model is "+this.model);
        this.name = this.model.name;
        this.avatar = this.surface.createGroup();
        this.render();
	    this.portcount = 0;
    },
    
    flush: function()
    {
        if(this.avatar)
        {
            console.log("boxgraph.flush called for box '"+this.name+
                "'. this.avatar = "+this.avatar);
            this.move_event.remove();
            this.surface.remove(this.avatar);
            this.avatar = null;
        }
        if(this.ports.length > 0)
        {
            for(var i=0; i < this.ports.length; i++)
            {
                var port = this.ports[i];
                port.remove();
            }
        }
    },
    
    render: function()
    {
        //console.log("boxgraph.render called for box '"+this.name+
        // "'. this.surface = "+this.surface);
        //this.flush();
        this.renderEntity();
        this.renderPorts();  
        var nx = this.model.x + this.model.width / 2 - 40 *
            this.name.length;
        var ny = this.model.y + this.model.height / 2;
        //console.log("++ drawing name '"+this.name+
        // "' for box at "+nx+", "+ny);
        this.avatar.createText({text: this.name,
            x: nx, y: ny}).setFill("black");
    },
    
    renderEntity: function()
    {
        //console.log("-- renderentity called for "+this.name);
        var red_rect = this.surface.createRect(this.model).setFill("white");
        //red_rect.setFill([255, 0, 0, 0.5]);
		red_rect.setStroke({color: "#3AAACF", width: 2, join: "round" });

		//red_rect.setTransform({dx: 100, dy: 100});
		connect.connect(red_rect.getNode(), "onclick", lang.hitch(this,
            function(){ dojo.publish("box_clicked", [this]) }));
        connect.subscribe("box_clicked", lang.hitch(this, function(box)
        {
            if(box.name === this.name)
            {
                red_rect.setStroke({color: "#3AAACF", width: 3,
                    join: "round" });
            }
            else
            {
                red_rect.setStroke({color: "#3AAACF", width: 2,
                    join: "round" });
            }
        }));
		this.rect = red_rect;
        this.avatar.add(red_rect);

        var m = new gfxmoveable(this.avatar);

        this.moveable = m;
        this.move_event = connect.connect(m, "onMoved",
            lang.hitch(this, function(mover, shift)
        {
            // var o = line.getShape();
    	    // line.setShape({x1: o.x1 + shift.dx, y1: o.y1 +
    	    // shift.dy, x2: o.x2, y2: o.y2});
            //this.model.x += shift.dx;
            //this.model.y += shift.dy;
            this.model.x += shift.dx;
            this.model.y += shift.dy;
            //console.log(this.name+" model is now "+this.model.x
            // +","+this.model.y+" shift.dx = "+shift.dx+
            // ", shift.dy = "+shift.dy);
            //console.dir(shift);
            for(var p in this.ports)
            {
                var port = this.ports[p];
                port.x += shift.dx;
                port.y += shift.dy;                
            }
            dojo.publish("boxgraph_redraw");
    	}));

    },
    
    renderPorts: function()
    {
        //console.log("renderPorts called for "+this.name);
		//console.dir(this.ports);
        for(var p in this.ports)
        {
            var port = this.ports[p];
            //console.log("boxgraph.box renderPorts called for box '"+
            // this.name+"', rendering port "+p+", dir = '"+port.dir
            // +"', position = "+port.position);
            var x,y;
            var jiff = 5 * port.position;
            switch(port.dir)
            {
                case "left":
                    x = -10;
                    y = port.position * jiff;
                break;
                case "up":
                    x = port.position * jiff;
                    y = -10;
                break;
                case "right":
                    x = this.model.width;
                    y = port.position * jiff;
                break;
                case "down":
                    x = port.position * jiff;
                    y = this.model.height;
                break;
            }            
            port.remove();
            port.render(parseInt(this.model.x + x, 10),
                parseInt(this.model.y + y, 10));
            //this.avatar.add(port);
        }
        this.avatar.moveToBack(this.rect);
    },
        
    addPort: function(p)
    {        
        //console.log("boxgraph.addPort called. p is..");
        //console.dir(p);
        p.name = this.name+"_"+p.position+"_"+this.portcount++;
		if(!p.id) p.id = p.name;
        p.portid = p.id;
        p.box = this;
        p.surface = this.surface;
        //p.surface = this.avatar;
       
        var port = new bport(p);
		//console.log("Adding port '"+p.id+" to box '"+this.name+"'");
        this.ports[p.id] = port;
        
    },

	getPortById: function(id)
	{
		return this.ports[id];
	}
    })
})
