window.Hexgrid = (function() {
    //config
    var id = 'hexgrid';

    var log = function() {
        if ( 'undefined' !== typeof console && 'function' === typeof console.log ) {
            console.log.apply( console, arguments );
        }
    };

    var hexround = function( number ) {
        return Math.ceil( number ); //(Math.round(number * 4) / 4).toFixed(2);
    };

    /* Trig */
    var Trig = function() {};
    Trig.radiansToDegrees = function( a ) {
        return a * ( 180 / Math.PI );
    };
    Trig.degreesToRadians = function( a ) {
        return a * (Math.PI / 180);
    };
    Trig.dotProduct = function( a, b ) {
        var n = 0, lim = Math.min(a.length,b.length), i;
        for ( i = 0; i < lim; i++ ) {
			n += a[i] * b[i];
		}
        return n;
    };

	//TODO: implement for Trig.sameSide()
    Trig.crossProduct = function( a, b ) {

    };

    //Barycentric coordinate method
    //background: http://www.blackpawn.com/texts/pointinpoly/default.html
    //via http://koozdra.wordpress.com/2012/06/27/javascript-is-point-in-triangle/
    Trig.insideTriangle = function ( px, py, ax, ay, bx, by, cx, cy ) {

        var v0 = [cx-ax,cy-ay];
        var v1 = [bx-ax,by-ay];
        var v2 = [px-ax,py-ay];

        var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
        var dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
        var dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
        var dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
        var dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

        var invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return ((u >= 0) && (v >= 0) && (u + v < 1));
    }

    Trig.sameSide = function( p1, p2, a, b ) {
        cp1 = Trig.crossProduct( b - a, p1 - a );
        cp2 = Trig.crossProduct( b - a, p2 - a );
        if ( Trig.dotProduct( cp1, cp2 ) >= 0 ) {
            return true;
        } else {
            return false;
        }
    };

    /* Hexagon */
    var _sin_60 = Math.sin( Trig.degreesToRadians( 60 ) );
    var Hexagon = function(c, x, y ) {
        this.a = .5 * c;
        this.b = hexround( _sin_60 * c );
        this.c = c;
        this.xo = x;
        this.yo = y;
    };
    Hexagon.prototype.draw = function( ctx, type, line_color, line_width, fill_color) {

        var xo = this.xo, yo = this.yo, width = this.width;
        if ( 'string' !== typeof fill_color ) {
			fill_color = 'transparent';
        }
		ctx.fillStyle = fill_color;
        ctx.lineStyle = line_color;
        ctx.lineWidth = line_width;
        ctx.beginPath();
        ctx.moveTo(xo, yo + ( width - ( .25 * width ) ) );
        var x = 0, points = this.points(), xlen = points.length, point;
        for ( ; x < 6 ; x += 1 ) {
            point = points[ x ];
            ctx.lineTo( point[ 0 ], point[ 1 ] );
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if ( 'box' === type ) {

            //box right
            ctx.beginPath();
            ctx.fillStyle = '#eee';
            ctx.lineStyle = line_color;
            ctx.lineWidth = line_width;
            ctx.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.lineTo(xo, yo + ( width - ( .25 * width ) ) );
            ctx.lineTo( points[ 5 ][ 0 ], points[ 5 ][ 1 ] );
            ctx.lineTo( points[ 4 ][ 0 ], points[ 4 ][ 1 ] );
            ctx.lineTo( points[ 3 ][ 0 ], points[ 3 ][ 1 ] );
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            //box left
            ctx.beginPath();
            ctx.fillStyle = '#ccc';
            ctx.lineStyle = line_color;
            ctx.lineWidth = line_width;
            ctx.moveTo( points[ 0 ][ 0 ], points[ 0 ][ 1 ] );
            ctx.lineTo( points[ 1 ][ 0 ], points[ 1 ][ 1 ] );
            ctx.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.lineTo( points[ 5 ][ 0 ], points[ 5 ][ 1 ] );
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            //box top
            ctx.fillStyle = '#ddd';
            ctx.lineStyle = line_color;
            ctx.lineWidth = line_width;
            ctx.beginPath();
            ctx.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.lineTo( points[ 1 ][ 0 ], points[ 1 ][ 1 ] );
            ctx.lineTo( points[ 2 ][ 0 ], points[ 2 ][ 1 ] );
            ctx.lineTo( points[ 3 ][ 0 ], points[ 3 ][ 1 ] );
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

        } else if ( '3d' === type ) {

            //bottom left
            //top left
            ctx.beginPath();
            ctx.lineStyle = 'transparent';
            ctx.fillStyle = '#ccc';
            ctx.lineWidth = line_width;
            ctx.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.lineTo( points[ 0 ][ 0 ], points[ 0 ][ 1 ] );
            ctx.lineTo( points[ 5 ][ 0 ], points[ 5 ][ 1 ] );
            ctx.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.stroke();
            ctx.fill();

            //left
            ctx.beginPath();
            ctx.lineStyle = 'transparent';
            ctx.lineWidth = line_width;
            ctx.fillStyle = '#ccc';
            ctx.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.lineTo( points[ 1 ][ 0 ], points[ 1 ][ 1 ] );
            ctx.lineTo( points[ 0 ][ 0 ], points[ 0 ][ 1 ] );
            ctx.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.stroke();
            ctx.fill();

            //top right
            ctx.beginPath();
            ctx.fillStyle = '#ddd';
            ctx.lineStyle = '#000';
            ctx.lineWidth = line_width;
            ctx.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.lineTo( points[ 3 ][ 0 ], points[ 3 ][ 1 ] );
            ctx.lineTo( points[ 2 ][ 0 ], points[ 2 ][ 1 ] );
            ctx.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.fill();
            ctx.stroke();

            //top left
            ctx.beginPath();
            ctx.lineStyle = '#000';
            ctx.fillStyle = '#ddd';
            ctx.lineWidth = line_width;
            ctx.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.lineTo( points[ 2 ][ 0 ], points[ 2 ][ 1 ] );
            ctx.lineTo( points[ 1 ][ 0 ], points[ 1 ][ 1 ] );
            ctx.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.stroke();
            ctx.fill();

            //right
            ctx.beginPath();
            ctx.lineStyle = line_color;
            ctx.fillStyle = '#eee';
            ctx.lineWidth = line_width;
            ctx.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.lineTo( points[ 4 ][ 0 ], points[ 4 ][ 1 ] );
            ctx.lineTo( points[ 3 ][ 0 ], points[ 3 ][ 1 ] );
            ctx.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.stroke();
            ctx.fill();

            //bottom right
            ctx.beginPath();
            ctx.lineStyle = line_color;
            ctx.fillStyle = '#eee';
            ctx.lineWidth = line_width;
            ctx.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.lineTo( points[ 5 ][ 0 ], points[ 5 ][ 1 ] );
            ctx.lineTo( points[ 4 ][ 0 ], points[ 4 ][ 1 ] );
            ctx.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            ctx.stroke();
            ctx.fill();

        }
    }
    Hexagon.prototype.xoffset = function() {
       return this.xo;
    };
    Hexagon.prototype.yoffset = function() {
       return this.yo;
    };
    Hexagon.prototype.width = function() {
       return 2 * this.c;
    };
    Hexagon.prototype.points = function() {
        return [
            this.one()
            , this.two()
            , this.three()
            , this.four()
            , this.five()
            , this.six()
            , this.seven()
        ];
    };
    /*x,y*/
    Hexagon.prototype.one = function() { return [ this.xo, hexround( this.yo + this.a + this.c ) ] };
    Hexagon.prototype.two = function() { return [ this.xo, hexround( this.yo + this.a ) ] };
    Hexagon.prototype.three = function() { return [ hexround( this.xo + this.b ), this.yo + 0  ] };
    Hexagon.prototype.four = function() { return [ hexround( this.xo + ( 2 * this.b ) ), hexround( this.yo + this.a ) ]; };
    Hexagon.prototype.five = function() { return [ hexround( this.xo + ( 2 * this.b ) ), hexround( this.yo + this.a + this.c ) ] };
    Hexagon.prototype.six = function() { return [ hexround( this.xo + this.b ), hexround( this.yo + ( 2 * this.c ) ) ]; };
    Hexagon.prototype.seven = function() { return [ hexround( this.xo + this.b ), hexround( this.yo + ( 2 * this.c - ( 2 * this.a ) ) ) ] };
    Hexagon.prototype.eight = function() { return [ hexround( this.xo + this.b ), hexround( this.yo + ( 2 * this.a ) ) ]; };

    //we know you've clicked inside
    //the hexagon if either 1) you've clicked in the main rectangle (easy)
    //or in the upper or lower triangles (ungodly difficult for math mortals)
    //trading off speed for simplicity: the time it would take to figure to figure out which triangle to check didn't beat
    //just checking both traignels
    Hexagon.prototype.hit = function(x, y) {
        var points = this.points();
        var result = false;
        if (
            x >= points[ 1 ][ 0 ]
            && x < points[ 3 ][ 0 ]
            && y >= points[ 1 ][ 1 ]
            && y < points[ 4 ][ 1 ]
        ) {
            result = true;
        } else {
            //bottom left
            //bottom right
            result = Trig.insideTriangle(
                x
                , y
                , points[ 0 ][ 0 ]
                , points[ 0 ][ 1 ]
                , points[ 5 ][ 0 ]
                , points[ 5 ][ 1 ]
                , points[ 4 ][ 0 ]
                , points[ 4 ][ 1 ]
            );
            //top right
            //top left
            if ( false === result ) {
                result = Trig.insideTriangle(
                    x
                    , y
                    , points[ 1 ][ 0 ]
                    , points[ 1 ][ 1 ]
                    , points[ 2 ][ 0 ]
                    , points[ 2 ][ 1 ]
                    , points[ 3 ][ 0 ]
                    , points[ 3 ][ 1 ]
                );
            }
        }
        return result;
    };

	/* Neighbors */

    var Neighbors = function(hexagon, canvas, context) {
		this.hexagon = hexagon;
        this.context = context;
        this.canvas = canvas;
		/* 6 neighbors */
		var that = this
		, results = []
		, left = function (hex) {
			return {
				row: hex.row
				, column: hex.column - 1
			};
		}
		, right = function(hex) {
			return {
				row: hex.row
				, column: hex.column + 1
			};
		}
		, topRight = function(hex) {
			if ( 0 !== ( hex.row % 2 ) ) {
				return { 
					row: hex.row - 1
					, column: hex.column + 1
				};
			} else {
				return { 
					row: hex.row - 1
					, column: hex.column
				};
			}
		}
		, bottomRight = function(hex) {
			if ( 0 !== ( hex.row % 2 ) ) {
				return { 
					row: hex.row + 1
					, column: hex.column + 1
				};
			} else {
				return { 
					row: hex.row + 1
					, column: hex.column
				};
			}
		}
		, topLeft = function(hex) {
			if ( 0 !== ( hex.row % 2 ) ) {
				return {
					row: hex.row - 1
					, column: hex.column
				};
			} else {
				return {
					row: hex.row - 1
					, column: hex.column - 1
				};
			}
		}
		, bottomLeft = function(hex) {
			if ( 0 !== ( hex.row % 2 ) ) {
				return { 
					row: hex.row + 1
					, column: hex.column
				};
			} else {
				return { 
					row: hex.row + 1
					, column: hex.column - 1
				};
			}
		}, PublicAPI = function( data, layers, idx ) {
			var data = !!data ? data : []
			, idx = ( 'undefined' === typeof idx || !idx ) ? 1 : idx
			, layers = ( 'undefined' === typeof layers || !layers ) ? 3 : layers
			, get_layer = function(hex) {
					return [
						left(hex)
						, right(hex)
						, topRight(hex)
						, bottomRight(hex)
						, topLeft(hex)
						, bottomLeft(hex)
					];
			}, merge_layers = function( l1, l2 ) {
					var x = 0, xlen = l2.length;
					for ( ; x < xlen ; x += 1 ) {
						l1.push( l2[ x ] );
					}
					return l1;
			}, do_layer = function(dd, ll, ii, hex ) {
					if ( !ii || ii > ll ) {
						return dd;
					} else if ( ii <= ll ) {
						var d = merge_layers( dd, get_layer( hex ) );
						return do_layer( d, ll, ii + 1, hex );
					}
			};
			do_layer( [], layers, idx, that.hexagon);
        };
		return PublicAPI;
    };

    /* API */
    var that = this;
    var API = function(hexagon, canvas, context) {
		this.hexagon = hexagon;
        this.context = context;
        this.canvas = canvas;
    };

    API.prototype.image = function( options ) {
        if ( 'undefined' === typeof options ) {
          return;
        }
        var src = options.src
            , xPt = options.x
            , yPt = options.y
            , width = options.width
            , height = options.height
            , clip = options.clip || {}
            , clipX = clip.x
            , clipY = clip.y
            , clipWidth = clip.width
            , clipHeight = clip.height;
        var img = new Image();
        img.src = src;
        var api = this;
        img.onload = function() {
            //standard
            var ctx = api.context;
            var pts = api.hexagon.points(), x = 1, ptct = pts.length, pt;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo( pts[ 0 ][ 0 ], pts[ 0 ][ 1 ] );
            for ( ; x < 6 ; x += 1 ) {
                pt = pts[ x ];
                ctx.lineTo( pts[ x ][ 0 ], pts[ x ][ 1 ] );
            }
            ctx.closePath();
            ctx.clip();
            if ( 'undefined' !== typeof clipWidth ) {
                //sliced images
                //api.context.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                ctx.drawImage(img, xPt, yPt, width, height, clipX, clipY, clipWidth, clipHeight );
            } else if ( 'undefined' !== typeof width ) {
                //scaled images
                //api.context.drawImage(img, x, y, width, height);
                ctx.drawImage(img, xPt, yPt, width, height );
            } else {
                ctx.drawImage(img, xPt, yPt );
            }

            ctx.restore();

        };

    };
    API.prototype.video = function( src, resize ) {
        if ( 'undefined' === typeof resize ) {
            resize = false;
        }
    };

    /* Public */
    var Public = function (args) {
        var attr;
        for ( attr in args ) { if ( args.hasOwnProperty( attr ) ) { this[ attr ] = args[ attr ]; } };
		if ( 'string' === typeof this.fill ) {
			this.fill = { color: this.fill };
        }
        this.run();
		if ( 'function' === typeof this.onready ) {
			this.onready.apply( this, arguments );
		}
    };
    Public.prototype.run = function() {
        var that = this;
        [ this.setup, this.create, this.draw ].forEach( function( fn ) { fn.apply( that, [] ); } );
    };
    Public.prototype.detect = function(e, handler) {
        var clickX = e.clientX - e.target.offsetLeft, clickY = e.clientY - e.target.offsetTop;
        var x = 0, xlen = this.grid.length, row;
        for( ; x < xlen ; x += 1 ) {
            row = this.grid[ x ];
            if ( clickY > row[0].yoffset() && clickY < row[0].yoffset() + row[0].width()  ) {
                var y = 0, ylen = row.length, item;
                for ( ; y < ylen ; y += 1 ) {
                    item = row[ y ];
                    if( true === item.hit( clickX, clickY ) ) {
                        if ( 'function' === typeof handler ) {
                            handler( {
                                row: x
                                , column: ( y + 1 )
                                , data: item
                                , api: new API( item, this.canvas, this.context)
                            } );
                        }
                    }
                }
            }
        }
    };

    Public.prototype.mousemove = function(e) {
        var that = this;
        this.detect(e, function(d) {
            var data = d.data;
            if ( 'undefined' !== typeof that.previous ) {
                if( that.previous.data !== data ) {
                    if ( 'function' === typeof that.onmouseout ) {
                        that.onmouseout( that.previous );
                    }
                    if ( 'function' === typeof that.onmouseover ) {
                        that.onmouseover( d );
                    }
                }
            }
            that.previous = d;
        });
    };
    Public.prototype.click = function(e) {
        this.detect(e, this.onclick);
    };
    Public.prototype.mouseover = function(e) {
        this.detect(e, this.onmouseover);
    };
    Public.prototype.mouseout = function(e) {
        this.detect(e, this.onmouseout);
    };
    Public.prototype.setup = function() {
        this.node = document.getElementById( this.id );
        if ( ! Public.prototype.setup.added  ) {
            this.canvas = document.createElement( 'canvas' );
            this.context = this.canvas.getContext( '2d' );
            this.canvas.id = id; //config var
            this.node.appendChild( this.canvas );
            Public.prototype.setup.added = true;
        };
        this.line_width = this.line.width;
        this.line_style = this.line.color;
        this.canvas.width = this.node.clientWidth;
        this.canvas.style.width = this.node.clientWidth;
        this.canvas.height = this.node.clientHeight;
        this.canvas.style.height = this.node.clientHeight;
        this.bounds = this.canvas.getBoundingClientRect();
        this.model = { width: this.side };
		this.yoffset = this.node.offsetTop;
		this.xoffset = this.node.offsetLeft;
        var w = this.canvas.width - this.line_width;
        var h = this.canvas.height - this.line_width;
        this.rows = ( h - ( h % ( this.side * 1.5 ) ) ) / ( this.side * 1.5 );
        this.count = ( ( w - ( 1 * this.side ) ) - ( ( w - ( 1 * this.side ) ) % ( this.side * 1.75 ) ) ) / ( this.side * 1.75 );
    };
    Public.prototype.setup.added = false;

    Public.prototype.create = function() {
        var row = 0, idx, hexagons, hexagon, rows = [], width = this.model.width;
        for ( ; row < this.rows ; row += 1 ) {
            hexagons = [];
            var yoffset = (1.5 * this.model.width ) * ( row - 1 );
            for ( idx = 0; idx < this.count ; idx += 1 ) {
                var xoffset;
                if ( row ) {
                    if ( 0 === row % 2 ) {
                        //xoffset = 0;
                        xoffset = .5 * ( 1.75 * this.model.width ) + ( idx * ( 1.75 * this.model.width ) );
                    } else {
                        xoffset = idx * ( 1.75 * this.model.width );
                    }
                }
                if ('undefined' === typeof xoffset || xoffset < 0 ) {
                    xoffset = 0;
                }
                if ('undefined' === typeof yoffset || yoffset < 0 ) {
                    yoffset = 0;
                }
                var hex = new Hexagon( width, xoffset, yoffset );
				hex.row = row + 1;
				hex.column = idx + 1;
                hexagons.push( hex );
            }
            rows.push( hexagons );
        }
        this.grid = rows;
    };

    Public.prototype.draw = function() {
        var x = 0, y, rowlen, gridlen = this.grid.length, row, hex, points;
        for ( ; x < gridlen; x += 1 ) {
            row = this.grid[ x ];
            rowlen = row.length;
            y = 0;
            for ( ; y < rowlen; y += 1 ) {
                hex = row[ y ];
                this.hexagon( hex );
            }
        }
        if ( ! Public.prototype.draw.added ) {
            var that = this;
            window.addEventListener( 'resize', function() { that.run.apply( that, arguments ); } );
            this.canvas.addEventListener( 'click', function() { that.click.apply( that, arguments ); } );
            this.canvas.addEventListener( 'mousemove', function() { that.mousemove.apply( that, arguments ); } );
            Public.prototype.draw.added = true;
        }
    };

    Public.prototype.hexagon = function( hex ) {
        var points = hex.points(), xo = hex.xoffset(), yo = hex.yoffset(), width = hex.width();
        //this.box = ( Math.random() >.5 ) ? true : false;
        //this.threed = ( Math.random() > .7 ) ? true : false;
        var boxtype = 'normal';
        hex.draw( this.context, boxtype, this.line.color, this.line.width, this.fill.color );
        if ( 'function' === typeof this.ondraw ) {
            this.ondraw( { data: hex, api: new API( hex, this.canvas, this.context ) } );
        }

    };

    Public.prototype.get = function( args ) {
		if ( !!args.row && !!args.column ) { 
			var data = this.grid[ args.row - 1 ][ args.column - 1 ];
			return {
				row: args.row
				, column: args.column
				, data: data
				, api: new API( data, this.canvas, this.context)
				, neighbors: new Neighbors( data, this.canvas, this.context )
			};
		} else {
			return this.grid;
		}
	};

    Public.prototype.set = function( args ) {
		console.log('set hex', args );
	};
    Public.prototype.draw.added = false;
    return Public;
})();
