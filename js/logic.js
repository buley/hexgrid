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
        var n = 0, lim = Math.min(a.length,b.length);
        for (var i = 0; i < lim; i++) n += a[i] * b[i];
        return n;
    };
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
            , this.eight()
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
        } else if (
            x > points[ 0 ][ 0 ]
            && x < points[ 4 ][ 0 ]
            && y > points[ 2 ][ 1 ]
            && y < points[ 5 ][ 1 ]
        ) {
            if ( y > points[ 4 ][ 1 ] ) {
                if (
                    x > points[ 0 ][ 0 ]
                    && x < points[ 5 ][ 0 ]
                ) {
                    //bottom left
                    result = Trig.insideTriangle(
                        x
                        , y
                        , points[ 0 ][ 0 ]
                        , points[ 0 ][ 1 ]
                        , points[ 5 ][ 0 ]
                        , points[ 5 ][ 1 ]
                        , points[ 5 ][ 0 ]
                        , points[ 5 ][ 1 ] - this.a
                    );
                } else if (
                    x > points[ 5 ][ 0 ]
                    && x < points[ 4 ][ 0 ]
                ) {
                    //bottom right
                    result = Trig.insideTriangle(
                        x
                        , y
                        , points[ 4 ][ 0 ]
                        , points[ 4 ][ 1 ]
                        , points[ 5 ][ 0 ]
                        , points[ 5 ][ 1 ]
                        , points[ 5 ][ 0 ]
                        , points[ 5 ][ 1 ] - this.a
                    );
                }
            } else if ( y < points[ 3 ][ 1 ] ) {

                if (
                    x > points[ 0 ][ 0 ]
                    && x < points[ 5 ][ 0 ]
                ) {
                    //top left
                    result = Trig.insideTriangle(
                        x
                        , y
                        , points[ 1 ][ 0 ]
                        , points[ 1 ][ 1 ]
                        , points[ 2 ][ 0 ]
                        , points[ 2 ][ 1 ]
                        , points[ 2 ][ 0 ]
                        , points[ 2 ][ 1 ] + this.a
                    );
                } else if (
                    x > points[ 5 ][ 0 ]
                    && x < points[ 4 ][ 0 ]
                ) {
                    //top right
                    result = Trig.insideTriangle(
                        x
                        , y
                        , points[ 3 ][ 0 ]
                        , points[ 3 ][ 1 ]
                        , points[ 2 ][ 0 ]
                        , points[ 2 ][ 1 ]
                        , points[ 2 ][ 0 ]
                        , points[ 2 ][ 1 ] + this.a
                    );
                }
            }
        }
        return result;
    };

    /* Public */
    var Public = function (args) {
        var attr;
        for ( attr in args ) { if ( args.hasOwnProperty( attr ) ) { this[ attr ] = args[ attr ]; } };
        this.run();
    };
    Public.prototype.run = function() {
        var that = this;
        [ this.setup, this.create, this.draw ].forEach( function( fn ) { fn.apply( that, [] ); } );
    };
    Public.prototype.click = function(e) {
        var clickX = e.clientX, clickY = e.clientY;
        var x = 0, xlen = this.grid.length, row;
        for( ; x < xlen ; x += 1 ) {
            row = this.grid[ x ];
            if ( clickY > row[0].yoffset() && clickY < row[0].yoffset() + row[0].width()  ) {
                var y = 0, ylen = row.length, item;
                for ( ; y < ylen ; y += 1 ) {
                    item = row[ y ];
                    if( true === item.hit( clickX, clickY ) ) {
                        if ( 'function' === typeof this.onclick ) {
                            this.onclick( {
                                row: x
                                , column: ( y + 1 )
                                , data: item
                            } );
                        }
                    }
                }
            }
        }
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
        this.line_width = 1;
        this.canvas.width = this.node.clientWidth;
        this.canvas.style.width = this.node.clientWidth;
        this.canvas.height = this.node.clientHeight;
        this.canvas.style.height = this.node.clientHeight;
        this.model = { width: this.side };
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
                var hex = new Hexagon( width, xoffset, yoffset );
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
                this.hexagon( hex.points(), hex.xoffset(), hex.yoffset(), hex.width() );
            }
        }
        if ( ! Public.prototype.draw.added ) {
            var that = this;
            window.addEventListener( 'resize', function() { that.run.apply( that, arguments ); } );
            this.canvas.addEventListener( 'click', function() { that.click.apply( that, arguments ); } );
            Public.prototype.draw.added = true;
        }
    };

    Public.prototype.hexagon = function(points, xo, yo, width) {
        //this.box = ( Math.random() >.5 ) ? true : false;
        //this.threed = ( Math.random() > .7 ) ? true : false;
        this.context.fillStyle = '#ffffff';
        this.context.lineStyle = '#000000';
        this.context.lineWidth = this.line_width;
        this.context.beginPath();
        this.context.moveTo(xo, yo + ( width - ( .25 * width ) ) );
        var x = 0, xlen = points.length, point;
        for ( ; x < 6 ; x += 1 ) {
            point = points[ x ];
            this.context.lineTo( point[ 0 ], point[ 1 ] );
        }
        this.context.closePath();
        this.context.fill();
        this.context.stroke();

        if ( true === this.box ) {

            //box right
            this.context.beginPath();
            this.context.fillStyle = '#eee';
            this.context.lineStyle = '#000000';
            this.context.lineWidth = this.line_width;
            this.context.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.lineTo(xo, yo + ( width - ( .25 * width ) ) );
            this.context.lineTo( points[ 5 ][ 0 ], points[ 5 ][ 1 ] );
            this.context.lineTo( points[ 4 ][ 0 ], points[ 4 ][ 1 ] );
            this.context.lineTo( points[ 3 ][ 0 ], points[ 3 ][ 1 ] );
            this.context.closePath();
            this.context.stroke();
            this.context.fill();

            //box left
            this.context.beginPath();
            this.context.fillStyle = '#ccc';
            this.context.lineStyle = '#000000';
            this.context.lineWidth = this.line_width;
            this.context.moveTo( points[ 0 ][ 0 ], points[ 0 ][ 1 ] );
            this.context.lineTo( points[ 1 ][ 0 ], points[ 1 ][ 1 ] );
            this.context.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.lineTo( points[ 5 ][ 0 ], points[ 5 ][ 1 ] );
            this.context.closePath();
            this.context.stroke();
            this.context.fill();

            //box top
            this.context.fillStyle = '#ddd';
            this.context.lineStyle = '#000000';
            this.context.lineWidth = this.line_width;
            this.context.beginPath();
            this.context.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.lineTo( points[ 1 ][ 0 ], points[ 1 ][ 1 ] );
            this.context.lineTo( points[ 2 ][ 0 ], points[ 2 ][ 1 ] );
            this.context.lineTo( points[ 3 ][ 0 ], points[ 3 ][ 1 ] );
            this.context.closePath();
            this.context.stroke();
            this.context.fill();

        } else if ( true === this.threed ) {

            //bottom left
            //top left
            this.context.beginPath();
            this.context.lineStyle = 'transparent';
            this.context.fillStyle = '#ccc';
            this.context.lineWidth = this.line_width;
            this.context.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.lineTo( points[ 0 ][ 0 ], points[ 0 ][ 1 ] );
            this.context.lineTo( points[ 5 ][ 0 ], points[ 5 ][ 1 ] );
            this.context.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.stroke();
            this.context.fill();

            //left
            this.context.beginPath();
            this.context.lineStyle = 'transparent';
            this.context.lineWidth = this.line_width;
            this.context.fillStyle = '#ccc';
            this.context.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.lineTo( points[ 1 ][ 0 ], points[ 1 ][ 1 ] );
            this.context.lineTo( points[ 0 ][ 0 ], points[ 0 ][ 1 ] );
            this.context.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.stroke();
            this.context.fill();

            //top right
            this.context.beginPath();
            this.context.fillStyle = '#ddd';
            this.context.lineStyle = '#000';
            this.context.lineWidth = this.line_width;
            this.context.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.lineTo( points[ 3 ][ 0 ], points[ 3 ][ 1 ] );
            this.context.lineTo( points[ 2 ][ 0 ], points[ 2 ][ 1 ] );
            this.context.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.fill();
            this.context.stroke();

            //top left
            this.context.beginPath();
            this.context.lineStyle = '#000';
            this.context.fillStyle = '#ddd';
            this.context.lineWidth = this.line_width;
            this.context.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.lineTo( points[ 2 ][ 0 ], points[ 2 ][ 1 ] );
            this.context.lineTo( points[ 1 ][ 0 ], points[ 1 ][ 1 ] );
            this.context.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.stroke();
            this.context.fill();

            //right
            this.context.beginPath();
            this.context.lineStyle = '#000000';
            this.context.fillStyle = '#eee';
            this.context.lineWidth = this.line_width;
            this.context.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.lineTo( points[ 4 ][ 0 ], points[ 4 ][ 1 ] );
            this.context.lineTo( points[ 3 ][ 0 ], points[ 3 ][ 1 ] );
            this.context.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.stroke();
            this.context.fill();

            //bottom right
            this.context.beginPath();
            this.context.lineStyle = '#000000';
            this.context.fillStyle = '#eee';
            this.context.lineWidth = this.line_width;this.line_width
            this.context.moveTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.lineTo( points[ 5 ][ 0 ], points[ 5 ][ 1 ] );
            this.context.lineTo( points[ 4 ][ 0 ], points[ 4 ][ 1 ] );
            this.context.lineTo( points[ 6 ][ 0 ], points[ 6 ][ 1 ] );
            this.context.stroke();
            this.context.fill();

        }

    };

    Public.prototype.draw.added = false;
    return Public;
})();