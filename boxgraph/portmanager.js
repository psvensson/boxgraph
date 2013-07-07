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
        "boxgraph/port",
        "boxgraph/connector",
        "boxgraph/boxmanager",
        "boxgraph/base",
        "dojo/on",
        "dojox/gfx/move",
        "dojo/_base/array",
        "dojo/_base/event",
        "dojo/_base/connect",
        "dojo/dom-geometry"
    ],
    function(declare, WidgetBase, TemplatedMixin, WidgetsInTemplateMixin,
             template, domStyle, baseFx, lang, gfx, port, connector,
             boxmanager, base, on, move, array, event, connect, domgeom)
    {
        return declare([],
            {
    surface                 : "",
    firstnode               : "",
    secondnode              : "",
    connectors              : [],
    boxmanager              : "",
	routing					: "curved", // "straight", "manhattan", "curved",
    numbering               : false,
    
    constructor: function(args)
    {
        this.surface = args.surface;
        this.boxmanager = args.boxmanager;
        this.routing = args.routing;

        var p = domgeom.position(this.boxmanager.editor.domNode, true);
        console.log("position props for editor is");
        console.dir(p);
        this.p = p;
        
        console.log("boxgraph.portmanager constructor. this.boxmanager = "+
            this.boxmanager);
        
        dojo.subscribe("port_highlight", dojo.hitch(this, function(arg)
        {                        
            if(arg)
            {
                //console.log("portmanager highlight subsciption event.
                // highlight port is now "+arg.name);
                this.highlightport = arg;   
            }
            else
            {
                //console.log("** portmanager highlight subsciption event.
                // highlightport is now deselected.");
                this.highlightport = null;
            }
        }));
        
        this.surface.connect("onmousedown", dojo.hitch(this, function(e)
        {
            dojo.stopEvent(e);
            //console.log("boxgraph.portmanager onmousedown event handler.
            // this.highlightport = "+this.highlightport);
            if(this.highlightport && !this.firstport)
            {               
                this.firstport = this.highlightport;   
                console.log("** setting first port to "+this.firstport);                               
                this.startConnect();
            }
        }));
        
        dojo.subscribe("boxgraph_disconnect", dojo.hitch(this, function(p1, p2)
        {
            var index = -1;
            array.forEach(this.connectors, function(connector, i)
            {
                console.log(" boxgraph_disconnect checking if "+
                    connector.firstport.name+" == "+p1.name+
                    " and "+connector.secondport+" == "+p2.name);
                if(connector.firstport == p1 && connector.secondport == p2)
                {
                    console.log("Yup index == "+index);
                    connector.line = null;
                    index = i;   
                }
            });
            if(index > -1)
            {
                var oldconnector = this.connectors.splice(index, 1);
                oldconnector.line = "";
                delete oldconnector;
            }
            console.log("this.connectors is now..");
            console.dir(this.connectors);
        }));
    },
    
    startConnect: function(e)
    {

        dojo.publish("startconnect",[]);
        //console.log("startconnect for port "+this.name+" called");
        this.drawLineEvent = this.surface.connect("onmousemove",
            this, this.drawLine);
        this.mouseupevent = this.surface.connect("onmouseup",
            this, this.stopConnect);
        connect.connect(this.surface, "ondragstart",
            function(e){ event.stopEvent(e); });
        connect.connect(this.surface, "onselectstart",
            function(e){ event.stopEvent(e); });
    },
    
    drawLine: function(e)
    {
        var fp = this.firstport;

        //console.dir(this.firstport);
        //console.dir(e);
          if(this.line)
          {
            this.surface.remove(this.line);
            this.line = null;
          }
          var j = parseInt(this.firstport.side/2, 10);
        var nx = parseInt(e.clientX) - parseInt(this.p.x);
        var ny = parseInt(e.clientY) - parseInt(this.p.y);
        //console.log("portmanager.drawLine.. firstport is "+
        // fp.x+", "+fp.y+", mouse is at "+ e.clientX+", "+
        // e.clientY+" nx - "+nx+", ny - "+ny);
        //console.dir(e);
          var ll = {x1: this.firstport.x + j, y1:
              this.firstport.y + j, x2: nx , y2:  ny};
          console.dir(ll);
        try
        {
          this.line = this.surface.createLine(ll);
        }
        catch(ee)
        {
            console.log("ERROR!! "+ee);
        }
          this.line.setStroke({color: "#06799F", width: 1});
    },
    
    stopConnect: function(e)
    {
        console.log("stopConnect called. this.firstport = "+this.firstport+", this.secondport = "+this.secondport+", this.highlightport = "+this.highlightport);
        var rv = "";
        dojo.publish("stopconnect",[]);
        //try
        //{
            if(this.drawLineEvent)
            {
                this.drawLineEvent.remove();
                this.mouseupevent.remove();
                this.drawLineEvent = null;
            }
            
            if(this.line)
            {
                this.surface.remove(this.line);
                this.line = null;
            }
            if(!this.secondport && this.highlightport)
            {
                this.secondport = this.highlightport;
                //console.log("** setting second port to "+this.secondport);
                
                dojo.publish("boxgraph_connect", [this.firstport, this.secondport]);
                var newconnection = new connector(
                {
                    routing: this.routing,
                    boxmanager: this.boxmanager,
                    surface: this.surface,
                    firstport: this.firstport,
                    secondport: this.secondport,
                    numbering: this.numbering
                });
                this.connectors.push(newconnection);
                rv = newconnection;
            }
            this.firstport = this.secondport = null;
        //}
        //catch(e)
        //{
        //    console.log("ERROR in stopConnect: "+e);
        //}
        return rv;
    },
    
    serializeConnections: function()
    {
        var rv = [];
        
        array.forEach(this.connectors, dojo.hitch(this, function(connector, i)
        {
            var f = connector.firstport;
            var s = connector.secondport;
            console.log("serializing connection "+i);
            console.dir({first: f, second: s});
            
            
            rv.push({ first: f.id, second: s.id });
            
        }));
        
        return rv;
    }
})
    })