function colorpicker(r,g,b,o)
{
	this.red 		= r;
	this.green 		= g;
	this.blue 		= b;
	this.opacity	= o;
	var max		= 255;
	var min		= 0;
	this.set		= set;
	function set(n, v)
	{
		return(this[n]>-1)?(v<=max&&v>=min)?this[n]=v:false:false;
	}
}