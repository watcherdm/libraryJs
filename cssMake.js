/*
what should a css javascript class do:
	allow me to define css parameters on the fly using javascript and inject those into my page without needing to rely on style attributes.
	simplify my life by allowing me to set variable defintions and reuse them in my css. (kinda like sass but on the fly).
	alternately allow me to write sass style css into an element and parse it into valid css.
*/
function css(id)
{
	var exports = {};
	this.id = id;
	this.text = "";
	this.rules = {classes:{},ids:{},tags:{}};
	this.newClass = newClass;
	this.addCss = addCss;
	this.newTag = newTag;
	this.renderRule = renderRule;
	this.render = render;
	this.dataStore = {};
	this.checkId = checkId;
	this.testData = "";
	function checkId(id)
	{
		var d = document.getElementById(id);
		if(d.innerText != "") {
			d.id = "__" + id;
			this.testData = d.innerText;
			this.dataStore = d;
			this.text = parseSass(this.testData);
			return this.text;
		}else{
			return false;
		}
	}
	function addCss(domObject)
	{
		var s = document.createElement("style");
		s.id = this.id;
		s.type = "text/css";
		this.domObj = s;
		return domObject.appendChild(s);
	}
	function newClass(className, jsonClass)
	{
		var c = '.' + className + '{';
		for(p in jsonClass)
		{
			c += "  " + p + ":" + jsonClass[p] + ";";
		}
		c+='}';
		this.rules.classes[className] = jsonClass;
		this.text += c + '\n';
		this.domObj.innerText = this.text;
		return c;
	}
	function newTag(tagName, jsonClass)
	{
		var c = tagName + '{';
		for(p in jsonClass)
		{
			c += "  " + p + ":" + jsonClass[p] + ";";
		}
		c+='}';
		this.rules.tags[tagName] = jsonClass;
		this.text += c + '\n';
		this.domObj.innerText = this.text;
		return c;
	}
	function render()
	{
		for(t in this.rules.tags)
		{
			this.renderRule(t, this.rules.classes[t]);
		}
		for(c in this.rules.classes)
		{
			this.renderRule('.' + c, this.rules.classes[c]);
		}
		for(i in this.rules.ids)
		{
			
		}
		this.domObj.innerText = this.text;
		return true;
	}
	function renderRule(n, obj)
	{
		
		// parse out the existing version of the rule and render it a new
		return n;
	}
	function parseSass(sassString)
	{
		return exports.render(sassString);
	}
	// Sass - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

	/**
	 * Library version.
	 */

	exports.version = '0.4.3'

	/**
	 * Compiled sass cache.
	 */
	 
	var cache = {}

	/**
	 * Sass grammar tokens.
	 */

	var tokens = [
	  ['indent', /^\n +/],
	  ['space', /^ +/],
	  ['nl', /^\n/],
	  ['js', /^{(.*?)}/],
	  ['comment', /^\/\/(.*)/],
	  ['string', /^(?:'(.*?)'|"(.*?)")/],
	  ['variable', /^!([\w\-]+) *= *([^\n]+)/], 
	  ['variable.alternate', /^([\w\-]+): +([^\n]+)/], 
	  ['property.expand', /^=([\w\-]+) *([^\n]+)/], 
	  ['property', /^:([\w\-]+) *([^\n]+)/], 
	  ['continuation', /^&(.+)/],
	  ['mixin', /^\+([\w\-]+)/],
	  ['selector', /^(.+)/]
	]

	/**
	 * Vendor-specific expansion prefixes.
	 */

	exports.expansions = ['-moz-', '-webkit-']

	/**
	 * Tokenize the given _str_.
	 *
	 * @param  {string} str
	 * @return {array}
	 * @api private
	 */

	function tokenize(str) {
	  var token, captures, stack = []
	  while (str.length) {
	    for (var i = 0, len = tokens.length; i < len; ++i)
	      if (captures = tokens[i][1].exec(str)) {
		token = [tokens[i][0], captures],
		str = str.replace(tokens[i][1], '')
		break
	      }
	    if (token)
	      stack.push(token),
	      token = null
	    else 
	      throw new Error("SyntaxError: near `" + str.slice(0, 25).replace('\n', '\\n') + "'")
	  }
	  return stack
	}
	exports.tokenize = tokenize;
	/**
	 * Parse the given _tokens_, returning
	 * and hash containing the properties below:
	 *
	 *   selectors: array of top-level selectors
	 *   variables: hash of variables defined
	 *
	 * @param  {array} tokens
	 * @return {hash}
	 * @api private
	 */
	function parse(tokens) {
	  var token, selector,
	      data = { variables: {}, mixins: {}, selectors: [] },
	      line = 1,
	      lastIndents = 0,
	      indents = 0
	  
	  /**
	   * Output error _msg_ in context to the current line.
	   */
	      
	  function error(msg) {
	    console.error('ParseError: on line ' + line + '; ' + msg)
	  }
	  
	  /**
	   * Reset parents until the indentation levels match.
	   */
	  
	  function reset() {
	    if (indents === 0) return selector = null
	    while (lastIndents-- > indents) selector = selector.parent
	  }
	  
	  // Parse tokens
	  
	  while (token = tokens.shift())
	    switch (token[0]) {
	      case 'mixin':
		if (indents) {
		  var mixin = data.mixins[token[1][1]]
		  if (!mixin) error("mixin `" + token[1][1] + "' does not exist") 
		  mixin.parent = selector
		  selector.children.push(mixin)
		}
		else
		  data.mixins[token[1][1]] = selector = new Selector(token[1][1], null, 'mixin')
		break
	      case 'continuation':
		reset()
		selector = new Selector(token[1][1], selector, 'continuation')
		break
	      case 'selector':
		reset()
		selector = new Selector(token[1][1], selector)
		if (!selector.parent) 
		  data.selectors.push(selector)
		break
	      case 'property':
		reset()
		if (!selector) error('properties must be nested within a selector')
		var val = token[1][2]
		  .replace(/!([\w\-]+)/g, function(orig, name){
		    return data.variables[name] || orig
		  })
		  .replace(/\{(.*?)\}/g, function(_, js){
		    with (data.variables){ return eval(js) }
		  })
		selector.properties.push(new Property(token[1][1], val))
		break
	      case 'property.expand':
		exports.expansions.forEach(function(prefix){
		  tokens.unshift(['property', [, prefix + token[1][1], token[1][2]]])
		})
		break
	      case 'variable':
	      case 'variable.alternate':
		data.variables[token[1][1]] = token[1][2]
		break
	      case 'js':
		with (data.variables){ eval(token[1][1]) }
		break
	      case 'nl':
		++line, indents = 0
		break
	      case 'comment':
		break
	      case 'indent':
		++line
		lastIndents = indents,
		indents = (token[1][0].length - 1) / 2
		if (indents > lastIndents && indents - 1 > lastIndents) error('invalid indentation, to much nesting')
	    }
	  return data
	}

	/**
	 * Compile _selectors_ to a string of css.
	 *
	 * @param  {array} selectors
	 * @return {string}
	 * @api private
	 */

	function compile(selectors) {
		var r = "";
		for(s in selectors){
			r += selectors[s].toString();
		}
		return r;
	}

	/**
	 * Collect data by parsing _sass_.
	 * Returns a hash containing the following properties:
	 *
	 *   selectors: array of top-level selectors
	 *   variables: hash of variables defined
	 *
	 * @param  {string} sass
	 * @return {hash}
	 * @api public
	 */

	exports.collect = function(sass) {
	  return parse(tokenize(sass))
	}

	/**
	 * Render a string of _sass_.
	 *
	 * Options:
	 *   
	 *   - filename  Optional filename to aid in error reporting
	 *   - cache     Optional caching of compiled content. Requires "filename" option
	 *
	 * @param  {string} sass
	 * @param  {object} options
	 * @return {string}
	 * @api public
	 */

	exports.render = function(sass) {
	  return compile(exports.collect(sass).selectors)
	}

	// --- Selector

	/**
	 * Initialize a selector with _string_ and
	 * optional _parent_.
	 *
	 * @param  {string} string
	 * @param  {Selector} parent
	 * @param  {string} type
	 * @api private
	 */

	function Selector(string, parent, type) {
	  this.string = string
	  this.parent = parent
	  this.properties = []
	  this.children = []
	  if (type) this[type] = true
	  if (parent) parent.children.push(this)
	}
	
	
	/**
	 * Return selector string.
	 *
	 * @return {string}
	 * @api private
	 */

	Selector.prototype.selector = function() {
	  var selector = this.string
	  if (this.parent) selector = this.continuation ? this.parent.selector() + selector : this.mixin ? this.parent.selector() : this.parent.selector() + ' ' + selector
	  return selector
	}

	/**
	 * Return selector and nested selectors as CSS.
	 *
	 * @return {string}
	 * @api private
	 */

	Selector.prototype.toString = function() {
		if(this.properties.length){
			r = this.selector() + ' {\n'
			for(p in this.properties){
				r += this.properties[p].toString() + "\n";
			}
			r += '}\n';
		}else{
			r = '';
		}
		for(c in this.children){
			r += this.children[c].toString()
		};
		return r;
	}

	// --- Property

	/**
	 * Initialize property with _name_ and _val_.
	 *
	 * @param  {string} name
	 * @param  {string} val
	 * @api private
	 */

	function Property(name, val) {
	  this.name = name
	  this.val = val
	}

	/**
	 * Return CSS string representing a property.
	 *
	 * @return {string}
	 * @api private
	 */

	Property.prototype.toString = function() {
	  return '  ' + this.name + ': ' + this.val + ';'
	}
	
	exports.parse = parse;
	this.exports = exports;
}
function cssTest()
{
	this.context = new css("TESTCONTEXT");
	this.next = new css("SECONDIMPORT");
	this.testBase = testBase;
	this.testCheckId = testCheckId;
	this.testAddCss = testAddCss;
	this.testNewClass = testNewClass;
	this.testNewTag = testNewTag;
	this.testRenderRule = testRenderRule;
	this.testRender = testRender;
	this.testFail = testFail;
	function testBase()
	{
		return assert(this.context);
	}
	function testAddCss()
	{
		var dh = document.head
		this.context.addCss(dh);
		this.next.addCss(dh);
		// the constructor should have done this already. test that it was done here.
		return assert(document.getElementById(this.context.id));
	}
	function testNewClass()
	{
		var className = 'newclass';
		var jsonClass = {color: "#f00"};
		var result = this.context.newClass(className, jsonClass);
		return assert(result == ".newclass{  color:#f00;}");
	}
	function testNewTag()
	{
		var tagName = 'body';
		var jsonClass = {background: "#eee"};
		var result = this.context.newTag(tagName, jsonClass);
		return assert(result == "body{  background:#eee;}");
	}
	function testCheckId()
	{
		var result1 = this.context.checkId(this.context.id);
		var result2 = this.next.checkId(this.next.id);
		var xres1 = document.getElementById(this.context.id + "_results").innerText;
		var xres2 = document.getElementById(this.next.id + "_results").innerText;
		return assert(veryAlike(result1,xres1)&&veryAlike(result2,xres2));
	}
	function testRenderRule()
	{
		return assert(this.context.renderRule("x",{}) == ("x"));
	}
	function testRender()
	{
		return assert(this.context.render()&&this.next.render());
	}
	function testFail()
	{
		return assert(1==0);
	}
	function runTests(context)
	{
		for(m in context)
		{
			var r = (typeof(context[m])=="function")?context[m]():'noop';
			switch(r){
				case true:
					console.log(m + " passed");
					break;
				case false:
					console.error(m + " failed");
					break;
				default:
					break;
			}
		}
		return true;
	}
	function assert(condition)
	{
		if(!condition)
		{
			return false;
		}
		return true;
	}
	function veryAlike(str1, str2)
	{
		str1 = str1.replace(/\s+/g, '');
		str2 = str2.replace(/\s+/g, '');
		return (str1==str2);
	}
	this.runTests = runTests(this);
	return this;
}
