BigTextTest = TestCase('BigTextTest');

BigTextTest.prototype.tolerance = 8;

// If the lines of text are blocks, testing their width will tell us nothing.
BigTextTest.prototype.init = function()
{
    return this.css({
        float: 'left',
        clear: 'left'
    });
};

BigTextTest.prototype.testExists = function()
{
    assertTrue(!!BigText);
    assertTrue(!!$.fn.bigtext);
};

BigTextTest.prototype.testStyleInjection = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>This is a simple test.</div></div>');
    $('#test').bigtext();

    assertTrue('Test to make sure the style tag was inserted.', $('#' + BigText.getStyleId('test')).length === 1);
};

BigTextTest.prototype.testDoubleStyleInjection = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>This is a simple test.</div></div>');
    $('#test').bigtext().bigtext();

    // FIXME this jQuery result won't return more than one element.
    assertTrue('Test to make sure the style tag wasn\'t inserted twice.', $('#' + BigText.getStyleId('test')).length === 1);
};


BigTextTest.prototype.testCleanup = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>This is a simple test.</div></div>');
    $('#test').bigtext();

    assertTrue('Clone should be deleted.', $('.bigtext-cloned').length === 0);
};

BigTextTest.prototype.linesTest = function(selector, expectedWidth, options)
{
    var minWidth = expectedWidth - this.tolerance,
        maxWidth = expectedWidth + this.tolerance,
        options = options || {},
        $test = $(selector),
        $lines = $test.find(options.childSelector || '> *');

    this.init.call($lines);

    $lines.each(function(j)
    {
        var width = $(this).width();
        assertFalse('Line ' + j + ' is not max width (' + width + ')', minWidth < width && width < maxWidth);
    });

    $test.bigtext(options);

    assertTrue('Class added.', $test.is('.bigtext'));

    $lines.each(function(j)
    {
        var $t = $(this),
            width = $t.width();

        assertTrue('Line ' + j + ' class added.', $t.is('.bigtext-line' + j));
        assertTrue('Line ' + j + ' Font size must be larger than the starting pixel size', parseInt($t.css('font-size'), 10) > BigText.STARTING_PX_FONT_SIZE);
        assertTrue('Line ' + j + ' width should be about ' + expectedWidth + 'px (' + $t.width() + ')', minWidth < width && width < maxWidth);
    });
};

BigTextTest.prototype.testOneLine = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>This is a single line.</div></div>');

    this.linesTest('#test', 600);
};

BigTextTest.prototype.testTwoLines = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>This is</div><div>a longer second line</div></div>');

    this.linesTest('#test', 600);
};

BigTextTest.prototype.testThreeLines = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>This is</div><div>a longer second line</div><div>An even longer third line.</div></div>');

    this.linesTest('#test', 600);
};

BigTextTest.prototype.testThreeLinesWithAList = function()
{
    $(document.body).append('<ol id="test" style="width:600px"><li>This is</li><li>a longer second line</li><li>An even longer third line.</li></ol>');

    this.linesTest('#test', 600);
};

BigTextTest.prototype.testTwoElements = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>This is</div><div>a longer second line</div></div><div id="test2" style="width:400px"><div>This is</div><div>a longer second line</div></div>');

    this.linesTest('#test', 600);
    this.linesTest('#test2', 400);

    assertNotEquals('Line 1 of each is a different size.',
                        $('#test').find('> div').eq(0).css('font-size'),
                        $('#test2').find('> div').eq(0).css('font-size'));

    assertNotEquals('Line 2 of each is a different size.',
                        $('#test').find('> div').eq(1).css('font-size'),
                        $('#test2').find('> div').eq(1).css('font-size'));
};

BigTextTest.prototype.testPercentageWidth = function()
{
    $(document.body).append('<div style="width: 600px"><div id="test" style="width: 50%"><div>This is a single line.</div></div></div>');

    this.linesTest('#test', 300);
};

BigTextTest.prototype.testNoChildren = function()
{
    $(document.body).append('<div id="test" style="width: 600px">This is a single line.</div>');

    this.linesTest('#test', 300);
};

BigTextTest.prototype.testMaxFontSize = function()
{
    $(document.body).append('<div id="test" style="width:600px"><div>1</div></div>');
    $('#test').bigtext();

    assertEquals('Font size should equal the maximum.', $('#test > div').css('font-size'), BigText.STARTING_PX_FONT_SIZE * BigText.DEFAULT_MAX_FONT_SIZE_EM + 'px');
};

BigTextTest.prototype.testUnbrokenSingleWord = function()
{
    $(document.body).append('<div id="test" style="width:300px"><div>This</div></div>');
    $('#test').bigtext();

    assertTrue('Font size must be larger than the starting pixel size.', parseInt($('#test > div').css('font-size'), 10) > BigText.STARTING_PX_FONT_SIZE);
};