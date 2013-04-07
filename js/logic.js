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
            Public.prototype.draw.added = true;
        }
    };

    Public.prototype.hexagon = function(points, xo, yo, width) {
        //this.box = ( Math.random() >.3 ) ? true : false;
        this.context.fillStyle = '#EEEEEE';
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
            this.context.fillStyle = '#ddd';
            this.context.beginPath();
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
            this.context.fillStyle = '#eee';
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

        }

    };

    Public.prototype.draw.added = false;
    return Public;
})();