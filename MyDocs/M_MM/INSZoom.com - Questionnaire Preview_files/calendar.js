//***************************************************************************
//Name:Calendar.js
//Purpose:This is template which displays popup calendar calendar 
//Created By:Manjunath madanbhavi
//Date by:17/10/2001 


// Modified By : Taher N D on 11/19/2009
// Modified For : Hiding WebEditPro while Showing Calendar (as calendar was goin behind webeditpro control)
//              : [Task Id :- GBL18Nov2009-38-37950 Compose Email - Access Date Calendar]
// Modified for  : task id;GBL02JUL2012-Dll Monster CTS UAT Issue fix by Ajay kumar N for not getting script error on mouseclick event// Modifed
//Modified for   : Zendesk#44570: Shortcut with Gap - Case Manager Search ny Usha Yeli on 09 NOV 2013
//Modified By Usha Yeli for Syncing this file from Production
//Modified By Akshata R for #2188 GBLEnhance18FEB2014-48984-DateCalculator
//Modified By Akshata R for #3136GBL16APRIL2014-48984-DateCalculator
//Modofied By Sudarshan Prabhu  for #5291
//Modified By Diptikanta P on 6th-Nov-2015 for Task - TFS: 18613:Handle Digital Document and Doc Checklist Access Rights.
//****************************************************************************

//********* SPECIFY DATE FORMAT RETURNED BY THIS CALENDAR*********************
calDateFormat = "MM/DD/yyyy";

//**************CALENDAR COLORS***********************************************
topBackground = "white";			// BG COLOR OF THE TOP FRAME
bottomBackground = "white";			// BG COLOR OF THE BOTTOM FRAME
tableBGColor = "#ffd700";		// BG COLOR OF THE BOTTOM FRAME'S TABLE
//(TO AFFECT THE BORDER COLOR)
//***************FORMATTING PREFERENCES***************************************
bottomBorder = false;        // TRUE/FALSE (WHETHER TO DISPLAY BOTTOM CALENDAR BORDER)
tableBorder = 0;            // SIZE OF CALENDAR TABLE BORDER (BOTTOM FRAME) 0=none
// DETERMINE BROWSER BRAND
var isNav = false;
var isIE = false;

// ASSUME IT'S EITHER NETSCAPE OR MSIE
if (navigator.appName == "Netscape") {
    isNav = true;
}
else {
    isIE = true;
}

// GET CURRENTLY SELECTED LANGUAGE
selectedLanguage = navigator.language;

// PRE-BUILD PORTIONS OF THE CALENDAR WHEN THIS JS LIBRARY LOADS INTO THE BROWSER
buildCalParts();

// CALENDAR FUNCTIONS BEGIN HERE ---------------------------------------------------

// SET THE INITIAL VALUE OF THE GLOBAL DATE FIELD
function setDateField(dateField) {

    // ASSIGN THE INCOMING FIELD OBJECT TO A GLOBAL VARIABLE
    calDateField = dateField;

    // GET THE VALUE OF THE INCOMING FIELD
    inDate = dateField.value;

    // SET calDate TO THE DATE IN THE INCOMING FIELD OR DEFAULT TO TODAY'S DATE
    setInitialDate();

    // THE CALENDAR FRAMESET DOCUMENTS ARE CREATED BY JAVASCRIPT FUNCTIONS
    calDocTop = buildTopCalFrame();
    calDocBottom = buildBottomCalFrame();
}


// SET THE INITIAL CALENDAR DATE TO TODAY OR TO THE EXISTING VALUE IN dateField
function setInitialDate() {

    // CREATE A NEW DATE OBJECT (WILL GENERALLY PARSE CORRECT DATE EXCEPT WHEN "." IS USED AS A DELIMITER)
    // (THIS ROUTINE DOES *NOT* CATCH ALL DATE FORMATS, IF YOU NEED TO PARSE A CUSTOM DATE FORMAT, DO IT HERE)
    calDate = new Date(inDate);

    // IF THE INCOMING DATE IS INVALID, USE THE CURRENT DATE
    if (isNaN(calDate)) {

        // ADD CUSTOM DATE PARSING HERE
        // IF IT FAILS, SIMPLY CREATE A NEW DATE OBJECT WHICH DEFAULTS TO THE CURRENT DATE
        calDate = new Date();
    }

    // KEEP TRACK OF THE CURRENT DAY VALUE
    calDay = calDate.getDate();

    // SET DAY VALUE TO 1... TO AVOID JAVASCRIPT DATE CALCULATION ANOMALIES
    // (IF THE MONTH CHANGES TO FEB AND THE DAY IS 30, THE MONTH WOULD CHANGE TO MARCH
    //  AND THE DAY WOULD CHANGE TO 2.  SETTING THE DAY TO 1 WILL PREVENT THAT)
    calDate.setDate(1);
}

//ADDED BY MANJUNATH MADANBHAVI FOR CALANDAR POSTION
//DATE:10/17/2001
//FUNCTION TO CHECK TYPE OF BROWSER

function lib_bwcheck() { //Browsercheck (needed)
    this.ver = navigator.appVersion
    this.agent = navigator.userAgent
    this.dom = document.getElementById ? 1 : 0
    this.opera5 = this.agent.indexOf("Opera 5") > -1
    this.ie5 = (this.ver.indexOf("MSIE 5") > -1 && this.dom && !this.opera5) ? 1 : 0;
    this.ie6 = (this.ver.indexOf("MSIE 6") > -1 && this.dom && !this.opera5) ? 1 : 0;
    this.ie4 = (document.all && !this.dom && !this.opera5) ? 1 : 0;
    this.ie = this.ie4 || this.ie5 || this.ie6
    this.mac = this.agent.indexOf("Mac") > -1
    this.ns6 = (this.dom && parseInt(this.ver) >= 5) ? 1 : 0;
    this.ns4 = (document.layers && !this.dom) ? 1 : 0;
    this.bw = (this.ie6 || this.ie5 || this.ie4 || this.ns4 || this.ns6 || this.opera5)
    return this
}

var bw = new lib_bwcheck()

//Capturing mousemove
var descx = 0;
var descy = 0;

fromXX = 0; //How much from the actual mouse X should the description box appear?
fromYY = 0;//How much from the actual mouse Y should the description box appear?

// A unit of measure that will be added when setting the position of a layer.
var px = bw.ns4 || window.opera ? "" : "px";
function popmousemove(e) {
    descx = bw.ns4 || bw.ns6 ? (e || window.event || { type: 'undef' }).pageX : event.screenX;
    descy = bw.ns4 || bw.ns6 ? (e || window.event || { type: 'undef' }).pageY : event.screenY;
}

function setPopup() {
    if (bw.ns4)
        document.captureEvents(Event.MOUSEDOWN)
    document.onmousedown = popmousemove;
}

setPopup();
// POPUP A WINDOW WITH THE CALENDAR IN IT
function showCalendar(dateField) {
    //if(bw.ie5||bw.ie6) 
    //descy = descy+document.body.scrollTop

    corX = (descx + fromXX) + px;
    corY = (descy + fromYY) + px;

    //alert(corX);
    //alert(corY);

    if (bw.ie5 || bw.ie6) {
        winPrefs = "'dependent=yes,width=220,height=230,titlebar=yes,left=" + corX + ",top=" + corY + " '"
    }
    else {
        winPrefs = "'dependent=yes,width=220,height=218,titlebar=yes,screenX=" + corX + ",screenY=" + corY + " '"
    }

    //alert (winPrefs);
    // SET INITIAL VALUE OF THE DATE FIELD AND CREATE TOP AND BOTTOM FRAMES
    setDateField(dateField);

    // USE THE JAVASCRIPT-GENERATED DOCUMENTS (calDocTop, calDocBottom) IN THE FRAMESET
    calDocFrameset =
        "<HTML><HEAD><TITLE>INSZoom Calendar...</TITLE></HEAD>\n" +
        "<FRAMESET ROWS='22,*' FRAMEBORDER='0'>\n" +
        "  <FRAME NAME='topCalFrame' SRC='javascript:parent.opener.calDocTop' noresize SCROLLING='no' valign=top >\n" +
        "  <FRAME NAME='bottomCalFrame' SRC='javascript:parent.opener.calDocBottom' noresize SCROLLING='no'>\n" +
        "</FRAMESET>\n";

    // DISPLAY THE CALENDAR IN A NEW POPUP WINDOW
    top.newWin = window.open("javascript:parent.opener.calDocFrameset", "calWin", winPrefs);
    top.newWin.focus();
}
// CREATE THE TOP CALENDAR FRAME
function buildTopCalFrame() {
    // CREATE THE TOP FRAME OF THE CALENDAR
    var calDoc =
        "<HTML>" +
        "<HEAD>" +
        "<LINK REL='STYLESHEET' HREF='../CorpInclude/h1b_style.css' TYPE='text/css'>" +
        "<STYLE>" +
        "</STYLE>" +
        "<TITLE>Zoom Calendar" +
        "</TITLE>" +
        "</HEAD>" +
        "<BODY topmargin=0 leftmargin=0 BGCOLOR='" + topBackground + "'>" +
        "<FORM NAME='calControl' onSubmit='return false;'>" +
        "<CENTER>" +
        "<TABLE CELLPADDING=0 CELLSPACING=1 BORDER=0>" +
        "<TR><TD>" +
        "<INPUT TYPE=BUTTON NAME='today' VALUE='Today' onClick='parent.opener.setToday()' CLASS='ButtonBlue'>" +
        "</TD>" +
        "<TD>" +
        getMonthSelect() +
        "</TD>" +
        "<TD>" +
        getYearSelect() +
        "</TD>" +
        "</TR>" +
        "</TABLE>" +
        "</CENTER>" +
        "</FORM>" +
        "</BODY>" +
        "</HTML>";
    return calDoc;
}


// CREATE THE BOTTOM CALENDAR FRAME 
// (THE MONTHLY CALENDAR)
function buildBottomCalFrame() {

    // START CALENDAR DOCUMENT
    var calDoc = calendarBegin;

    // GET MONTH, AND YEAR FROM GLOBAL CALENDAR DATE
    month = calDate.getMonth();
    year = calDate.getFullYear();

    // GET GLOBALLY-TRACKED DAY VALUE (PREVENTS JAVASCRIPT DATE ANOMALIES)
    day = calDay;
    var i = 0;

    // DETERMINE THE NUMBER OF DAYS IN THE CURRENT MONTH
    var days = getDaysInMonth();

    // IF GLOBAL DAY VALUE IS > THAN DAYS IN MONTH, HIGHLIGHT LAST DAY IN MONTH
    if (day > days) {
        day = days;
    }

    // DETERMINE WHAT DAY OF THE WEEK THE CALENDAR STARTS ON
    var firstOfMonth = new Date(year, month, 1);

    // GET THE DAY OF THE WEEK THE FIRST DAY OF THE MONTH FALLS ON
    var startingPos = firstOfMonth.getDay();
    days += startingPos;

    // KEEP TRACK OF THE COLUMNS, START A NEW ROW AFTER EVERY 7 COLUMNS
    var columnCount = 0;

    // MAKE BEGINNING NON-DATE CELLS BLANK
    for (i = 0; i < startingPos; i++) {

        calDoc += blankCell;
        columnCount++;
    }

    // SET VALUES FOR DAYS OF THE MONTH
    var currentDay = 0;
    var dayType = "weekday";

    // DATE CELLS CONTAIN A NUMBER
    for (i = startingPos; i < days; i++) {

        var paddingChar = "&nbsp;";

        // ADJUST SPACING SO THAT ALL LINKS HAVE RELATIVELY EQUAL WIDTHS
        if (i - startingPos + 1 < 10) {
            padding = "&nbsp;&nbsp;";
        }
        else {
            padding = "&nbsp;";
        }

        // GET THE DAY CURRENTLY BEING WRITTEN
        currentDay = i - startingPos + 1;

        // SET THE TYPE OF DAY, THE focusDay GENERALLY APPEARS AS A DIFFERENT COLOR
        if (currentDay == day) {
            dayType = "CalDateSel";
        }
        else {
            dayType = "CALDATE";
        }

        // ADD THE DAY TO THE CALENDAR STRING
        calDoc += "<TD ID=" + dayType + "  width='30' height='25'>" +
                  "<a href='javascript:parent.opener.returnDate(" +
                  currentDay + ")'>" + padding + currentDay + paddingChar + "</a></TD>";

        columnCount++;

        // START A NEW ROW WHEN NECESSARY
        if (columnCount % 7 == 0) {
            calDoc += "</TR><TR>";
        }
    }

    // MAKE REMAINING NON-DATE CELLS BLANK
    for (i = days; i < 42; i++) {
        calDoc += blankCell;
        columnCount++;

        // START A NEW ROW WHEN NECESSARY
        if (columnCount % 7 == 0) {
            calDoc += "</TR>";
            if (i < 41) {
                calDoc += "<TR>";
            }
        }
    }
    //SHOW CALENDAR CLOSE BUTTON
    calDoc += "<TR>\n"
    calDoc += "<TD bgcolor='" + bottomBackground + "' align='center' colspan='7'>\n"
    calDoc += "<INPUT TYPE=BUTTON NAME='today' VALUE=' Close ' onClick='top.window.close();' CLASS='ButtonBlue' >"
    calDoc += "</TD>\n"
    calDoc += "</TR>\n"
    // FINISH THE NEW CALENDAR PAGE
    calDoc += calendarEnd;
    // RETURN THE COMPLETED CALENDAR PAGE
    return calDoc;
}


// WRITE THE MONTHLY CALENDAR TO THE BOTTOM CALENDAR FRAME
function writeCalendar() {

    // CREATE THE NEW CALENDAR FOR THE SELECTED MONTH & YEAR
    calDocBottom = buildBottomCalFrame();

    // WRITE THE NEW CALENDAR TO THE BOTTOM FRAME
    top.newWin.frames['bottomCalFrame'].document.open();
    top.newWin.frames['bottomCalFrame'].document.write(calDocBottom);
    top.newWin.frames['bottomCalFrame'].document.close();
}


// SET THE CALENDAR TO TODAY'S DATE AND DISPLAY THE NEW CALENDAR
function setToday() {

    // SET GLOBAL DATE TO TODAY'S DATE
    calDate = new Date();
    calDay = calDate.getDate();
    // SET DAY MONTH AND YEAR TO TODAY'S DATE
    var month = calDate.getMonth();
    var year = calDate.getFullYear();
    // SET MONTH IN DROP-DOWN LIST
    top.newWin.frames['topCalFrame'].document.calControl.month.selectedIndex = month;

    // SET YEAR VALUE
    top.newWin.frames['topCalFrame'].document.calControl.year.value = year;

    // DISPLAY THE NEW CALENDAR
    writeCalendar();
}


// SET THE GLOBAL DATE TO THE NEWLY ENTERED YEAR AND REDRAW THE CALENDAR
function setYear() {

    // GET THE NEW YEAR VALUE
    var year = top.newWin.frames['topCalFrame'].document.calControl.year.value;
    // IF IT'S A FOUR-DIGIT YEAR THEN CHANGE THE CALENDAR
    if (isFourDigitYear(year)) {
        calDate.setFullYear(year);
        writeCalendar();
    }
    else {
        // HIGHLIGHT THE YEAR IF THE YEAR IS NOT FOUR DIGITS IN LENGTH
        top.newWin.frames['topCalFrame'].document.calControl.year.focus();
        top.newWin.frames['topCalFrame'].document.calControl.year.select();
    }
}


// SET THE GLOBAL DATE TO THE SELECTED MONTH AND REDRAW THE CALENDAR
function setCurrentMonth() {

    // GET THE NEWLY SELECTED MONTH AND CHANGE THE CALENDAR ACCORDINGLY
    var month = top.newWin.frames['topCalFrame'].document.calControl.month.selectedIndex;

    calDate.setMonth(month);
    writeCalendar();
}


// SET THE GLOBAL DATE TO THE PREVIOUS YEAR AND REDRAW THE CALENDAR
function setPreviousYear() {

    var year = top.newWin.frames['topCalFrame'].document.calControl.year.value;

    if (isFourDigitYear(year) && year > 1000) {
        year--;
        calDate.setFullYear(year);
        top.newWin.frames['topCalFrame'].document.calControl.year.value = year;
        writeCalendar();
    }
}


// SET THE GLOBAL DATE TO THE PREVIOUS MONTH AND REDRAW THE CALENDAR
function setPreviousMonth() {

    var year = top.newWin.frames['topCalFrame'].document.calControl.year.value;
    if (isFourDigitYear(year)) {
        var month = top.newWin.frames['topCalFrame'].document.calControl.month.selectedIndex;

        // IF MONTH IS JANUARY, SET MONTH TO DECEMBER AND DECREMENT THE YEAR
        if (month == 0) {
            month = 11;
            if (year > 1000) {
                year--;
                calDate.setFullYear(year);
                top.newWin.frames['topCalFrame'].document.calControl.year.value = year;
            }
        }
        else {
            month--;
        }
        calDate.setMonth(month);
        top.newWin.frames['topCalFrame'].document.calControl.month.selectedIndex = month;
        writeCalendar();
    }
}


// SET THE GLOBAL DATE TO THE NEXT MONTH AND REDRAW THE CALENDAR
function setNextMonth() {

    var year = top.newWin.frames['topCalFrame'].document.calControl.year.value;

    if (isFourDigitYear(year)) {
        var month = top.newWin.frames['topCalFrame'].document.calControl.month.selectedIndex;

        // IF MONTH IS DECEMBER, SET MONTH TO JANUARY AND INCREMENT THE YEAR
        if (month == 11) {
            month = 0;
            year++;
            calDate.setFullYear(year);
            top.newWin.frames['topCalFrame'].document.calControl.year.value = year;
        }
        else {
            month++;
        }
        calDate.setMonth(month);
        top.newWin.frames['topCalFrame'].document.calControl.month.selectedIndex = month;
        writeCalendar();
    }
}


// SET THE GLOBAL DATE TO THE NEXT YEAR AND REDRAW THE CALENDAR
function setNextYear() {

    var year = top.newWin.frames['topCalFrame'].document.calControl.year.value;
    if (isFourDigitYear(year)) {
        year++;
        calDate.setFullYear(year);
        top.newWin.frames['topCalFrame'].document.calControl.year.value = year;
        writeCalendar();
    }
}


// GET NUMBER OF DAYS IN MONTH
function getDaysInMonth() {

    var days;
    var month = calDate.getMonth() + 1;
    var year = calDate.getFullYear();

    // RETURN 31 DAYS
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 ||
        month == 10 || month == 12) {
        days = 31;
    }
        // RETURN 30 DAYS
    else if (month == 4 || month == 6 || month == 9 || month == 11) {
        days = 30;
    }
        // RETURN 29 DAYS
    else if (month == 2) {
        if (isLeapYear(year)) {
            days = 29;
        }
            // RETURN 28 DAYS
        else {
            days = 28;
        }
    }
    return (days);
}


// CHECK TO SEE IF YEAR IS A LEAP YEAR
function isLeapYear(Year) {

    if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
        return (true);
    }
    else {
        return (false);
    }
}


// ENSURE THAT THE YEAR IS FOUR DIGITS IN LENGTH
function isFourDigitYear(year) {

    if (year.length != 4) {
        top.newWin.frames['topCalFrame'].document.calControl.year.value = calDate.getFullYear();
        top.newWin.frames['topCalFrame'].document.calControl.year.select();
        top.newWin.frames['topCalFrame'].document.calControl.year.focus();
    }
    else {
        return true;
    }
}


// BUILD THE MONTH SELECT LIST
function getMonthSelect() {

    // BROWSER LANGUAGE CHECK DONE PREVIOUSLY (navigator.language())
    // FIRST TWO CHARACTERS OF LANGUAGE STRING SPECIFIES THE LANGUAGE
    // (THE LAST THREE OPTIONAL CHARACTERS SPECIFY THE LANGUAGE SUBTYPE)
    // SET THE NAMES OF THE MONTH TO THE PROPER LANGUAGE (DEFAULT TO ENGLISH)

    // IF FRENCH
    if (selectedLanguage == "fr") {
        monthArray = new Array('Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                               'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre');
    }
        // IF GERMAN
    else if (selectedLanguage == "de") {
        monthArray = new Array('Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                               'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember');
    }
        // IF SPANISH
    else if (selectedLanguage == "es") {
        monthArray = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
    }
        // DEFAULT TO ENGLISH
    else {
        monthArray = new Array('January', 'February', 'March', 'April', 'May', 'June',
                               'July', 'August', 'September', 'October', 'November', 'December');
    }

    // DETERMINE MONTH TO SET AS DEFAULT
    var activeMonth = calDate.getMonth();

    // START HTML SELECT LIST ELEMENT
    monthSelect = "<SELECT NAME='month' onChange='parent.opener.setCurrentMonth()' ID='ComboBox'>";

    // LOOP THROUGH MONTH ARRAY
    //for (i in monthArray) {
    for (var i = 0; i < monthArray.length; i++) {
        // SHOW THE CORRECT MONTH IN THE SELECT LIST
        if (i == activeMonth) {
            monthSelect += "<OPTION SELECTED>" + monthArray[i] + "\n";
        }
        else {
            monthSelect += "<OPTION>" + monthArray[i] + "\n";
        }
    }
    monthSelect += "</SELECT>";
    // RETURN A STRING VALUE WHICH CONTAINS A SELECT LIST OF ALL 12 MONTHS
    return monthSelect;
}


// SET DAYS OF THE WEEK DEPENDING ON LANGUAGE
function createWeekdayList() {

    // IF FRENCH
    if (selectedLanguage == "fr") {
        weekdayList = new Array('Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi');
        weekdayArray = new Array('Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa');
    }
        // IF GERMAN
    else if (selectedLanguage == "de") {
        weekdayList = new Array('Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag');
        weekdayArray = new Array('So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa');
    }
        // IF SPANISH
    else if (selectedLanguage == "es") {
        weekdayList = new Array('Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado')
        weekdayArray = new Array('Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa');
    }
    else {
        weekdayList = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
        weekdayArray = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
    }

    // START HTML TO HOLD WEEKDAY NAMES IN TABLE FORMAT
    var weekdays = "<TR>";

    // LOOP THROUGH WEEKDAY ARRAY
    for (i in weekdayArray) {

        weekdays += "<TD ID='CalMonthYear' width='30' height='25'>" + weekdayArray[i] + "</TD>";
    }
    weekdays += "</TR>";

    // RETURN TABLE ROW OF WEEKDAY ABBREVIATIONS TO DISPLAY ABOVE THE CALENDAR
    return weekdays;
}


// PRE-BUILD PORTIONS OF THE CALENDAR (FOR PERFORMANCE REASONS)
function buildCalParts() {

    // GENERATE WEEKDAY HEADERS FOR THE CALENDAR
    weekdays = createWeekdayList();

    // BUILD THE BLANK CELL ROWS
    blankCell = "<TD ID='CalDateBlank' width='30' height='25' >&nbsp;&nbsp;&nbsp;</TD>";

    // BUILD THE TOP PORTION OF THE CALENDAR PAGE USING CSS TO CONTROL SOME DISPLAY ELEMENTS
    calendarBegin =
        "<HTML>" +
        "<HEAD>" +
        // STYLESHEET DEFINES APPEARANCE OF CALENDAR
        "<LINK REL='STYLESHEET' HREF='../CorpInclude/h1b_style.css' TYPE='text/css'>" +
        "<STYLE type='text/css'>" +
        "</STYLE>" +
        "</HEAD>" +
        "<BODY topmargin=0 leftmargin=0 BGCOLOR='" + bottomBackground + "' valign=top align=left>";
    // NAVIGATOR NEEDS A TABLE CONTAINER TO DISPLAY THE TABLE OUTLINES PROPERLY
    if (isNav) {
        calendarBegin +=
            "<TABLE CELLPADDING=0 CELLSPACING=1 BORDER=" + tableBorder + " ALIGN=CENTER BGCOLOR='" + tableBGColor + "'><TR><TD>";
    }

    // BUILD WEEKDAY HEADINGS
    calendarBegin +=
        "<TABLE CELLPADDING=0 CELLSPACING=1 BORDER=" + tableBorder + " ALIGN=CENTER BGCOLOR='" + tableBGColor + "' >" +
        weekdays +
        "<TR>";


    // BUILD THE BOTTOM PORTION OF THE CALENDAR PAGE
    calendarEnd = "";

    // WHETHER OR NOT TO DISPLAY A THICK LINE BELOW THE CALENDAR
    if (bottomBorder) {
        calendarEnd += "<TR></TR>";
    }

    // NAVIGATOR NEEDS A TABLE CONTAINER TO DISPLAY THE BORDERS PROPERLY
    if (isNav) {
        calendarEnd += "</TD></TR></TABLE>";
    }

    // END THE TABLE AND HTML DOCUMENT
    calendarEnd +=
        "</TABLE>" +
        "</BODY>" +
        "</HTML>";
}


// REPLACE ALL INSTANCES OF find WITH replace
// inString: the string you want to convert
// find:     the value to search for
// replace:  the value to substitute
//
// usage:    jsReplace(inString, find, replace);
// example:  jsReplace("To be or not to be", "be", "ski");
//           result: "To ski or not to ski"
//
function jsReplace(inString, find, replace) {

    var outString = "";

    if (!inString) {
        return "";
    }

    // REPLACE ALL INSTANCES OF find WITH replace
    if (inString.indexOf(find) != -1) {
        // SEPARATE THE STRING INTO AN ARRAY OF STRINGS USING THE VALUE IN find
        t = inString.split(find);

        // JOIN ALL ELEMENTS OF THE ARRAY, SEPARATED BY THE VALUE IN replace
        return (t.join(replace));
    }
    else {
        return inString;
    }
}


// JAVASCRIPT FUNCTION -- DOES NOTHING (USED FOR THE HREF IN THE CALENDAR CALL)
function doNothing() {
}


// ENSURE THAT VALUE IS TWO DIGITS IN LENGTH
function makeTwoDigit(inValue) {

    var numVal = parseInt(inValue, 10);

    // VALUE IS LESS THAN TWO DIGITS IN LENGTH
    if (numVal < 10) {

        // ADD A LEADING ZERO TO THE VALUE AND RETURN IT
        return ("0" + numVal);
    }
    else {
        return numVal;
    }
}


// SET FIELD VALUE TO THE DATE SELECTED AND CLOSE THE CALENDAR WINDOW
function returnDate(inDay) {

    // inDay = THE DAY THE USER CLICKED ON
    calDate.setDate(inDay);

    // SET THE DATE RETURNED TO THE USER
    var day = calDate.getDate();
    var month = calDate.getMonth() + 1;
    var year = calDate.getFullYear();
    var monthString = monthArray[calDate.getMonth()];
    var monthAbbrev = monthString.substring(0, 3);
    var weekday = weekdayList[calDate.getDay()];
    var weekdayAbbrev = weekday.substring(0, 3);

    outDate = calDateFormat;

    // RETURN TWO DIGIT DAY
    if (calDateFormat.indexOf("DD") != -1) {
        day = makeTwoDigit(day);
        outDate = jsReplace(outDate, "DD", day);
    }
        // RETURN ONE OR TWO DIGIT DAY
    else if (calDateFormat.indexOf("dd") != -1) {
        outDate = jsReplace(outDate, "dd", day);
    }

    // RETURN TWO DIGIT MONTH
    if (calDateFormat.indexOf("MM") != -1) {
        month = makeTwoDigit(month);
        outDate = jsReplace(outDate, "MM", month);
    }
        // RETURN ONE OR TWO DIGIT MONTH
    else if (calDateFormat.indexOf("mm") != -1) {
        outDate = jsReplace(outDate, "mm", month);
    }

    // RETURN FOUR-DIGIT YEAR
    if (calDateFormat.indexOf("yyyy") != -1) {
        outDate = jsReplace(outDate, "yyyy", year);
    }
        // RETURN TWO-DIGIT YEAR
    else if (calDateFormat.indexOf("yy") != -1) {
        var yearString = "" + year;
        var yearString = yearString.substring(2, 4);
        outDate = jsReplace(outDate, "yy", yearString);
    }
        // RETURN FOUR-DIGIT YEAR
    else if (calDateFormat.indexOf("YY") != -1) {
        outDate = jsReplace(outDate, "YY", year);
    }

    // RETURN DAY OF MONTH (Initial Caps)
    if (calDateFormat.indexOf("Month") != -1) {
        outDate = jsReplace(outDate, "Month", monthString);
    }
        // RETURN DAY OF MONTH (lowercase letters)
    else if (calDateFormat.indexOf("month") != -1) {
        outDate = jsReplace(outDate, "month", monthString.toLowerCase());
    }
        // RETURN DAY OF MONTH (UPPERCASE LETTERS)
    else if (calDateFormat.indexOf("MONTH") != -1) {
        outDate = jsReplace(outDate, "MONTH", monthString.toUpperCase());
    }

    // RETURN DAY OF MONTH 3-DAY ABBREVIATION (Initial Caps)
    if (calDateFormat.indexOf("Mon") != -1) {
        outDate = jsReplace(outDate, "Mon", monthAbbrev);
    }
        // RETURN DAY OF MONTH 3-DAY ABBREVIATION (lowercase letters)
    else if (calDateFormat.indexOf("mon") != -1) {
        outDate = jsReplace(outDate, "mon", monthAbbrev.toLowerCase());
    }
        // RETURN DAY OF MONTH 3-DAY ABBREVIATION (UPPERCASE LETTERS)
    else if (calDateFormat.indexOf("MON") != -1) {
        outDate = jsReplace(outDate, "MON", monthAbbrev.toUpperCase());
    }

    // RETURN WEEKDAY (Initial Caps)
    if (calDateFormat.indexOf("Weekday") != -1) {
        outDate = jsReplace(outDate, "Weekday", weekday);
    }
        // RETURN WEEKDAY (lowercase letters)
    else if (calDateFormat.indexOf("weekday") != -1) {
        outDate = jsReplace(outDate, "weekday", weekday.toLowerCase());
    }
        // RETURN WEEKDAY (UPPERCASE LETTERS)
    else if (calDateFormat.indexOf("WEEKDAY") != -1) {
        outDate = jsReplace(outDate, "WEEKDAY", weekday.toUpperCase());
    }

    // RETURN WEEKDAY 3-DAY ABBREVIATION (Initial Caps)
    if (calDateFormat.indexOf("Wkdy") != -1) {
        outDate = jsReplace(outDate, "Wkdy", weekdayAbbrev);
    }
        // RETURN WEEKDAY 3-DAY ABBREVIATION (lowercase letters)
    else if (calDateFormat.indexOf("wkdy") != -1) {
        outDate = jsReplace(outDate, "wkdy", weekdayAbbrev.toLowerCase());
    }
        // RETURN WEEKDAY 3-DAY ABBREVIATION (UPPERCASE LETTERS)
    else if (calDateFormat.indexOf("WKDY") != -1) {
        outDate = jsReplace(outDate, "WKDY", weekdayAbbrev.toUpperCase());
    }

    // SET THE VALUE OF THE FIELD THAT WAS PASSED TO THE CALENDAR
    calDateField.value = outDate;

    // GIVE FOCUS BACK TO THE DATE FIELD
    calDateField.focus();

    // CLOSE THE CALENDAR WINDOW
    top.newWin.close()
}
//FUNCTION TO GET YEAR COMBO BOX
//ADED BY MANJUNATH MADANBHAVI
//DATE:10/17/2001
function getYearSelect() {
    var thisYear = calDate.getFullYear()
    var i
    var YearSelect
    var min = thisYear - 100
    var max = thisYear + 100
    YearSelect = "<Select name='year' onChange='parent.opener.setYear()' ID='ComboBox' >\n"
    for (i = min; i <= max; i++) {
        YearSelect = YearSelect + "<OPTION value='" + i + "'"
        if (thisYear == i) {
            YearSelect = YearSelect + "selected"
        }

        YearSelect = YearSelect + "> " + i + "</OPTION>\n"
    }

    YearSelect = YearSelect + "</SELECT>\n"
    //alert(YearSelect);
    return YearSelect;
}



///------------------------------new calendar--------------------------------------------

/*
(C) www.dhtmlgoodies.com, September 2005

*/
var languageCode = 'en';	// Possible values: 	en,ge,no,nl,es,pt-br,fr	
// en = english, ge = german, no = norwegian,nl = dutch, es = spanish, pt-br = portuguese, fr = french, da = danish, hu = hungarian(Use UTF-8 doctype for hungarian)

var calendar_display_time = true;

// Format of current day at the bottom of the calendar
// [todayString] = the value of todayString
// [dayString] = day of week (examle: mon, tue, wed...)
// [UCFdayString] = day of week (examle: Mon, Tue, Wed...) ( First letter in uppercase)
// [day] = Day of month, 1..31
// [monthString] = Name of current month
// [year] = Current year							
var todayStringFormat = '[todayString] [UCFdayString]. [day]. [monthString] [year]';
var pathToImages = '../Corpimages/';	// Relative to your HTML file

var speedOfSelectBoxSliding = 200;	// Milliseconds between changing year and hour when holding mouse over "-" and "+" - lower value = faster
var intervalSelectBox_minutes = 5;	// Minute select box - interval between each option (5 = default)

var calendar_offsetTop = 0;		// Offset - calendar placement - You probably have to modify this value if you're not using a strict doctype
var calendar_offsetLeft = 0;	// Offset - calendar placement - You probably have to modify this value if you're not using a strict doctype
var calendarDiv = false;

var MSIE = false;
var Opera = false;
if (navigator.userAgent.indexOf('MSIE') >= 0 && navigator.userAgent.indexOf('Opera') < 0) MSIE = true;
if (navigator.userAgent.indexOf('Opera') >= 0) Opera = true;


switch (languageCode) {
    case "en":	/* English */
        var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var monthArrayShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var dayArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var weekString = 'Week';
        var todayString = 'Today: ';
        break;



}



var daysInMonthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var currentMonth;
var currentYear;
var currentHour;
var currentMinute;
var calendarContentDiv;
var returnDateTo;
var returnFormat;
var activeSelectBoxMonth;
var activeSelectBoxYear;
var activeSelectBoxHour;
var activeSelectBoxMinute;

var iframeObj = false;

var returnDateToYear;
var returnDateToMonth;
var returnDateToDay;
var returnDateToHour;
var returnDateToMinute;

var inputYear;
var inputMonth;
var inputDay;
var inputHour;
var inputMinute;
var calendarDisplayTime = false;

var selectBoxHighlightColor = '#D60808'; // Highlight color of select boxes
var selectBoxRolloverBgColor = 'lightgrey'; // Background color on drop down lists(rollover)

var selectBoxMovementInProgress = false;
var activeSelectBox = false;

function cancelCalendarEvent() {
    return false;
}
function isLeapYear(inputYear) {
    if (inputYear % 400 == 0 || (inputYear % 4 == 0 && inputYear % 100 != 0)) return true;
    return false;

}
var activeSelectBoxMonth = false;
var activeSelectBoxDirection = false;

function highlightMonthYear() {
    if (activeSelectBoxMonth) activeSelectBoxMonth.className = '';
    activeSelectBox = this;


    if (this.className == 'monthYearActive') {
        this.className = '';
    } else {
        this.className = 'monthYearActive';
        activeSelectBoxMonth = this;
    }

    if (this.innerHTML.indexOf('-') >= 0 || this.innerHTML.indexOf('+') >= 0) {
        if (this.className == 'monthYearActive')
            selectBoxMovementInProgress = true;
        else
            selectBoxMovementInProgress = false;
        if (this.innerHTML.indexOf('-') >= 0) activeSelectBoxDirection = -1; else activeSelectBoxDirection = 1;

    } else selectBoxMovementInProgress = false;

}

function showMonthDropDown() {
    if (document.getElementById('monthDropDown').style.display == 'block') {
        document.getElementById('monthDropDown').style.display = 'none';
    } else {
        document.getElementById('monthDropDown').style.display = 'block';
        document.getElementById('yearDropDown').style.display = 'none';
        //document.getElementById('hourDropDown').style.display='none';
        //document.getElementById('minuteDropDown').style.display='none';
    }
}

function showYearDropDown() {
    if (document.getElementById('yearDropDown').style.display == 'block') {
        document.getElementById('yearDropDown').style.display = 'none';
    } else {
        document.getElementById('yearDropDown').style.display = 'block';
        document.getElementById('monthDropDown').style.display = 'none';
        //document.getElementById('hourDropDown').style.display='none';
        //document.getElementById('minuteDropDown').style.display='none';		
    }

}
function showHourDropDown() {
    if (document.getElementById('hourDropDown').style.display == 'block') {
        document.getElementById('hourDropDown').style.display = 'none';
    } else {
        document.getElementById('hourDropDown').style.display = 'block';
        document.getElementById('monthDropDown').style.display = 'none';
        document.getElementById('yearDropDown').style.display = 'none';
        document.getElementById('minuteDropDown').style.display = 'none';
    }

}
function showMinuteDropDown() {
    if (document.getElementById('minuteDropDown').style.display == 'block') {
        document.getElementById('minuteDropDown').style.display = 'none';
    } else {
        document.getElementById('minuteDropDown').style.display = 'block';
        document.getElementById('monthDropDown').style.display = 'none';
        document.getElementById('yearDropDown').style.display = 'none';
        document.getElementById('hourDropDown').style.display = 'none';
    }

}

function selectMonth() {
    document.getElementById('calendar_month_txt').innerHTML = this.innerHTML
    currentMonth = this.id.replace(/[^\d]/g, '');

    document.getElementById('monthDropDown').style.display = 'none';
    for (var no = 0; no < monthArray.length; no++) {
        document.getElementById('monthDiv_' + no).style.color = '';
    }
    this.style.color = selectBoxHighlightColor;
    activeSelectBoxMonth = this;
    writeCalendarContent();

}

function selectHour() {
    document.getElementById('calendar_hour_txt').innerHTML = this.innerHTML
    currentHour = this.innerHTML.replace(/[^\d]/g, '');
    document.getElementById('hourDropDown').style.display = 'none';
    if (activeSelectBoxHour) {
        activeSelectBoxHour.style.color = '';
    }
    activeSelectBoxHour = this;
    this.style.color = selectBoxHighlightColor;
}

function selectMinute() {
    document.getElementById('calendar_minute_txt').innerHTML = this.innerHTML
    currentMinute = this.innerHTML.replace(/[^\d]/g, '');
    document.getElementById('minuteDropDown').style.display = 'none';
    if (activeSelectBoxMinute) {
        activeSelectBoxMinute.style.color = '';
    }
    activeSelectBoxMinute = this;
    this.style.color = selectBoxHighlightColor;
}


function selectYear() {
    document.getElementById('calendar_year_txt').innerHTML = this.innerHTML
    currentYear = this.innerHTML.replace(/[^\d]/g, '');
    document.getElementById('yearDropDown').style.display = 'none';
    if (activeSelectBoxYear) {
        activeSelectBoxYear.style.color = '';
    }
    activeSelectBoxYear = this;
    this.style.color = selectBoxHighlightColor;
    writeCalendarContent();

}

function switchMonth() {
    if (this.src.indexOf('left') >= 0) {
        currentMonth = currentMonth - 1;;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear = currentYear - 1;
        }
    } else {
        currentMonth = currentMonth + 1;;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear = currentYear / 1 + 1;
        }
    }

    writeCalendarContent();


}

function createMonthDiv() {
    var div = document.createElement('DIV');
    div.className = 'monthYearPicker';
    div.id = 'monthPicker';

    for (var no = 0; no < monthArray.length; no++) {
        var subDiv = document.createElement('DIV');
        subDiv.innerHTML = monthArray[no];
        subDiv.onmouseover = highlightMonthYear;
        subDiv.onmouseout = highlightMonthYear;
        subDiv.onclick = selectMonth;
        subDiv.id = 'monthDiv_' + no;
        subDiv.style.width = '56px';
        subDiv.onselectstart = cancelCalendarEvent;
        div.appendChild(subDiv);
        if (currentMonth && currentMonth == no) {
            subDiv.style.color = selectBoxHighlightColor;
            activeSelectBoxMonth = subDiv;
        }

    }
    return div;

}

function changeSelectBoxYear(e, inputObj) {
    if (!inputObj) inputObj = this;
    var yearItems = inputObj.parentNode.getElementsByTagName('DIV');
    if (inputObj.innerHTML.indexOf('-') >= 0) {
        var startYear = yearItems[1].innerHTML / 1 - 1;
        if (activeSelectBoxYear) {
            activeSelectBoxYear.style.color = '';
        }
    } else {
        var startYear = yearItems[1].innerHTML / 1 + 1;
        if (activeSelectBoxYear) {
            activeSelectBoxYear.style.color = '';

        }
    }

    for (var no = 1; no < yearItems.length - 1; no++) {
        yearItems[no].innerHTML = startYear + no - 1;
        yearItems[no].id = 'yearDiv' + (startYear / 1 + no / 1 - 1);

    }
    if (activeSelectBoxYear) {
        activeSelectBoxYear.style.color = '';
        if (document.getElementById('yearDiv' + currentYear)) {
            activeSelectBoxYear = document.getElementById('yearDiv' + currentYear);
            activeSelectBoxYear.style.color = selectBoxHighlightColor;;
        }
    }
}
function changeSelectBoxHour(e, inputObj) {
    if (!inputObj) inputObj = this;

    var hourItems = inputObj.parentNode.getElementsByTagName('DIV');
    if (inputObj.innerHTML.indexOf('-') >= 0) {
        var startHour = hourItems[1].innerHTML / 1 - 1;
        if (startHour < 0) startHour = 0;
        if (activeSelectBoxHour) {
            activeSelectBoxHour.style.color = '';
        }
    } else {
        var startHour = hourItems[1].innerHTML / 1 + 1;
        if (startHour > 14) startHour = 14;
        if (activeSelectBoxHour) {
            activeSelectBoxHour.style.color = '';

        }
    }
    var prefix = '';
    for (var no = 1; no < hourItems.length - 1; no++) {
        if ((startHour / 1 + no / 1) < 11) prefix = '0'; else prefix = '';
        hourItems[no].innerHTML = prefix + (startHour + no - 1);

        hourItems[no].id = 'hourDiv' + (startHour / 1 + no / 1 - 1);

    }
    if (activeSelectBoxHour) {
        activeSelectBoxHour.style.color = '';
        if (document.getElementById('hourDiv' + currentHour)) {
            activeSelectBoxHour = document.getElementById('hourDiv' + currentHour);
            activeSelectBoxHour.style.color = selectBoxHighlightColor;;
        }
    }
}

function updateYearDiv() {
    var div = document.getElementById('yearDropDown');
    var yearItems = div.getElementsByTagName('DIV');
    for (var no = 1; no < yearItems.length - 1; no++) {
        yearItems[no].innerHTML = currentYear / 1 - 6 + no;
        if (currentYear == (currentYear / 1 - 6 + no)) {
            yearItems[no].style.color = selectBoxHighlightColor;
            activeSelectBoxYear = yearItems[no];
        } else {
            yearItems[no].style.color = '';
        }
    }
}

function updateMonthDiv() {
    for (no = 0; no < 12; no++) {
        document.getElementById('monthDiv_' + no).style.color = '';
    }
    document.getElementById('monthDiv_' + currentMonth).style.color = selectBoxHighlightColor;
    activeSelectBoxMonth = document.getElementById('monthDiv_' + currentMonth);
}


function updateHourDiv() {
    var div = document.getElementById('hourDropDown');
    var hourItems = div.getElementsByTagName('DIV');

    var addHours = 0;
    if ((currentHour / 1 - 6 + 1) < 0) {
        addHours = (currentHour / 1 - 6 + 1) * -1;
    }
    for (var no = 1; no < hourItems.length - 1; no++) {
        var prefix = '';
        if ((currentHour / 1 - 6 + no + addHours) < 10) prefix = '0';
        hourItems[no].innerHTML = prefix + (currentHour / 1 - 6 + no + addHours);
        if (currentHour == (currentHour / 1 - 6 + no)) {
            hourItems[no].style.color = selectBoxHighlightColor;
            activeSelectBoxHour = hourItems[no];
        } else {
            hourItems[no].style.color = '';
        }
    }
}

function updateMinuteDiv() {
    for (no = 0; no < 60; no += intervalSelectBox_minutes) {
        var prefix = '';
        if (no < 10) prefix = '0';

        document.getElementById('minuteDiv_' + prefix + no).style.color = '';
    }
    if (document.getElementById('minuteDiv_' + currentMinute)) {
        document.getElementById('minuteDiv_' + currentMinute).style.color = selectBoxHighlightColor;
        activeSelectBoxMinute = document.getElementById('minuteDiv_' + currentMinute);
    }
}



function createYearDiv() {

    if (!document.getElementById('yearDropDown')) {
        var div = document.createElement('DIV');
        div.className = 'monthYearPicker';
    } else {
        var div = document.getElementById('yearDropDown');
        var subDivs = div.getElementsByTagName('DIV');
        for (var no = 0; no < subDivs.length; no++) {
            subDivs[no].parentNode.removeChild(subDivs[no]);
        }
    }


    var d = new Date();
    if (currentYear) {
        d.setFullYear(currentYear);
    }

    var startYear = d.getFullYear() / 1 - 5;


    var subDiv = document.createElement('DIV');
    subDiv.innerHTML = '&nbsp;&nbsp;- ';
    subDiv.onclick = changeSelectBoxYear;
    subDiv.onmouseover = highlightMonthYear;
    subDiv.onmouseout = function () { selectBoxMovementInProgress = false; };
    subDiv.onselectstart = cancelCalendarEvent;
    div.appendChild(subDiv);

    for (var no = startYear; no < (startYear + 10) ; no++) {
        var subDiv = document.createElement('DIV');
        subDiv.innerHTML = no;
        subDiv.onmouseover = highlightMonthYear;
        subDiv.onmouseout = highlightMonthYear;
        subDiv.onclick = selectYear;
        subDiv.id = 'yearDiv' + no;
        subDiv.onselectstart = cancelCalendarEvent;
        div.appendChild(subDiv);
        if (currentYear && currentYear == no) {
            subDiv.style.color = selectBoxHighlightColor;
            activeSelectBoxYear = subDiv;
        }
    }
    var subDiv = document.createElement('DIV');
    subDiv.innerHTML = '&nbsp;&nbsp;+ ';
    subDiv.onclick = changeSelectBoxYear;
    subDiv.onmouseover = highlightMonthYear;
    subDiv.onmouseout = function () { selectBoxMovementInProgress = false; };
    subDiv.onselectstart = cancelCalendarEvent;
    div.appendChild(subDiv);
    return div;
}

/* This function creates the hour div at the bottom bar */

function slideCalendarSelectBox() {
    if (selectBoxMovementInProgress) {
        if (activeSelectBox.parentNode.id == 'hourDropDown') {
            changeSelectBoxHour(false, activeSelectBox);
        }
        if (activeSelectBox.parentNode.id == 'yearDropDown') {
            changeSelectBoxYear(false, activeSelectBox);
        }

    }
    setTimeout('slideCalendarSelectBox()', speedOfSelectBoxSliding);

}

function createHourDiv() {
    if (!document.getElementById('hourDropDown')) {
        var div = document.createElement('DIV');
        div.className = 'monthYearPicker';
    } else {
        var div = document.getElementById('hourDropDown');
        var subDivs = div.getElementsByTagName('DIV');
        for (var no = 0; no < subDivs.length; no++) {
            subDivs[no].parentNode.removeChild(subDivs[no]);
        }
    }

    if (!currentHour) currentHour = 0;
    var startHour = currentHour / 1;
    if (startHour > 14) startHour = 14;

    var subDiv = document.createElement('DIV');
    subDiv.innerHTML = '&nbsp;&nbsp;- ';
    subDiv.onclick = changeSelectBoxHour;
    subDiv.onmouseover = highlightMonthYear;
    subDiv.onmouseout = function () { selectBoxMovementInProgress = false; };
    subDiv.onselectstart = cancelCalendarEvent;
    div.appendChild(subDiv);

    for (var no = startHour; no < startHour + 10; no++) {
        var prefix = '';
        if (no / 1 < 10) prefix = '0';
        var subDiv = document.createElement('DIV');
        subDiv.innerHTML = prefix + no;
        subDiv.onmouseover = highlightMonthYear;
        subDiv.onmouseout = highlightMonthYear;
        subDiv.onclick = selectHour;
        subDiv.id = 'hourDiv' + no;
        subDiv.onselectstart = cancelCalendarEvent;
        div.appendChild(subDiv);
        if (currentYear && currentYear == no) {
            subDiv.style.color = selectBoxHighlightColor;
            activeSelectBoxYear = subDiv;
        }
    }
    var subDiv = document.createElement('DIV');
    subDiv.innerHTML = '&nbsp;&nbsp;+ ';
    subDiv.onclick = changeSelectBoxHour;
    subDiv.onmouseover = highlightMonthYear;
    subDiv.onmouseout = function () { selectBoxMovementInProgress = false; };
    subDiv.onselectstart = cancelCalendarEvent;
    div.appendChild(subDiv);

    return div;
}
/* This function creates the minute div at the bottom bar */

function createMinuteDiv() {
    if (!document.getElementById('minuteDropDown')) {
        var div = document.createElement('DIV');
        div.className = 'monthYearPicker';
    } else {
        var div = document.getElementById('minuteDropDown');
        var subDivs = div.getElementsByTagName('DIV');
        for (var no = 0; no < subDivs.length; no++) {
            subDivs[no].parentNode.removeChild(subDivs[no]);
        }
    }
    var startMinute = 0;
    var prefix = '';
    for (var no = startMinute; no < 60; no += intervalSelectBox_minutes) {

        if (no < 10) prefix = '0'; else prefix = '';
        var subDiv = document.createElement('DIV');
        subDiv.innerHTML = prefix + no;
        subDiv.onmouseover = highlightMonthYear;
        subDiv.onmouseout = highlightMonthYear;
        subDiv.onclick = selectMinute;
        subDiv.id = 'minuteDiv_' + prefix + no;
        subDiv.onselectstart = cancelCalendarEvent;
        div.appendChild(subDiv);
        if (currentYear && currentYear == no) {
            subDiv.style.color = selectBoxHighlightColor;
            activeSelectBoxYear = subDiv;
        }
    }
    return div;
}

function highlightSelect() {

    if (this.className == 'selectBoxTime') {
        this.className = 'selectBoxTimeOver';
        this.getElementsByTagName('IMG')[0].src = pathToImages + 'cal_down_time_over.gif';
    } else if (this.className == 'selectBoxTimeOver') {
        this.className = 'selectBoxTime';
        this.getElementsByTagName('IMG')[0].src = pathToImages + 'cal_down_time.gif';
    }

    if (this.className == 'selectBox') {
        this.className = 'selectBoxOver';
        this.getElementsByTagName('IMG')[0].src = pathToImages + 'cal_down_over.gif';
    } else if (this.className == 'selectBoxOver') {
        this.className = 'selectBox';
        this.getElementsByTagName('IMG')[0].src = pathToImages + 'cal_down.gif';
    }

}

function highlightArrow() {
    if (this.src.indexOf('over') >= 0) {
        if (this.src.indexOf('left') >= 0) this.src = pathToImages + 'cal_left.gif';
        if (this.src.indexOf('right') >= 0) this.src = pathToImages + 'cal_right.gif';
    } else {
        if (this.src.indexOf('left') >= 0) this.src = pathToImages + 'cal_left_over.gif';
        if (this.src.indexOf('right') >= 0) this.src = pathToImages + 'cal_right_over.gif';
    }
}

function highlightClose() {
    if (this.src.indexOf('over') >= 0) {
        this.src = pathToImages + 'cal_close.gif';
    } else {
        this.src = pathToImages + 'cal_close_over.gif';
    }

}

function closeCalendar() {
    if (MSIE) {
        if (document.getElementById("dvCalculator").style.visibility == 'visible') {
            document.getElementById("DCcboOperand").style.visibility = 'visible';
            document.getElementById("DCcboDays").style.visibility = 'visible';
        }
        else {
            __showSelect();
        }
    }

    __Calendar_ShowWebEditPro();

    document.getElementById('yearDropDown').style.display = 'none';
    document.getElementById('monthDropDown').style.display = 'none';
    //document.getElementById('hourDropDown').style.display='none';
    //document.getElementById('minuteDropDown').style.display='none';

    calendarDiv.style.display = 'none';
    if (iframeObj) iframeObj.style.display = 'none';
    if (activeSelectBoxMonth) activeSelectBoxMonth.className = '';
    if (activeSelectBoxYear) activeSelectBoxYear.className = '';


}

function writeTopBar() {

    var topBar = document.createElement('DIV');
    topBar.className = 'topBar';
    topBar.id = 'topBar';
    calendarDiv.appendChild(topBar);

    // Left arrow
    var leftDiv = document.createElement('DIV');
    leftDiv.style.marginRight = '1px';
    var img = document.createElement('IMG');
    img.src = pathToImages + 'cal_left.gif';
    img.onmouseover = highlightArrow;
    img.onclick = switchMonth;
    img.onmouseout = highlightArrow;
    leftDiv.appendChild(img);
    topBar.appendChild(leftDiv);
    if (Opera) leftDiv.style.width = '16px';


    // Month selector
    var monthDiv = document.createElement('DIV');
    monthDiv.id = 'monthSelect';
    monthDiv.onmouseover = highlightSelect;
    monthDiv.onmouseout = highlightSelect;
    monthDiv.onclick = showMonthDropDown;
    var span = document.createElement('SPAN');
    span.innerHTML = monthArray[currentMonth];
    span.id = 'calendar_month_txt';
    monthDiv.appendChild(span);

    var img = document.createElement('IMG');
    img.src = pathToImages + 'cal_down.gif';
    img.style.position = 'absolute';
    img.style.right = '0px';
    monthDiv.appendChild(img);
    monthDiv.className = 'selectBox';
    if (Opera) {
        img.style.cssText = 'float:right;position:relative';
        img.style.position = 'relative';
        img.style.styleFloat = 'right';
    }
    topBar.appendChild(monthDiv);

    var monthPicker = createMonthDiv();
    monthPicker.style.left = '26px';
    monthPicker.style.top = monthDiv.offsetTop + monthDiv.offsetHeight + 1 + 'px';
    monthPicker.style.width = '64px';
    monthPicker.id = 'monthDropDown';

    calendarDiv.appendChild(monthPicker);

    // Right arrow
    var rightDiv = document.createElement('DIV');
    rightDiv.style.marginRight = '1px';
    var img = document.createElement('IMG');
    img.src = pathToImages + 'cal_right.gif';
    img.onclick = switchMonth;
    img.onmouseover = highlightArrow;
    img.onmouseout = highlightArrow;
    rightDiv.appendChild(img);
    if (Opera) rightDiv.style.width = '16px';
    topBar.appendChild(rightDiv);

    // Year selector
    var yearDiv = document.createElement('DIV');
    yearDiv.onmouseover = highlightSelect;
    yearDiv.onmouseout = highlightSelect;
    yearDiv.onclick = showYearDropDown;
    var span = document.createElement('SPAN');
    span.innerHTML = currentYear;
    span.id = 'calendar_year_txt';
    yearDiv.appendChild(span);
    topBar.appendChild(yearDiv);

    var img = document.createElement('IMG');
    img.src = pathToImages + 'cal_down.gif';
    yearDiv.appendChild(img);
    yearDiv.className = 'selectBox';

    if (Opera) {
        yearDiv.style.width = '50px';
        img.style.cssText = 'float:right';
        img.style.position = 'relative';
        img.style.styleFloat = 'right';
    }

    var yearPicker = createYearDiv();
    yearPicker.style.left = '120px';
    yearPicker.style.top = monthDiv.offsetTop + monthDiv.offsetHeight + 1 + 'px';
    yearPicker.style.width = '50px';
    yearPicker.id = 'yearDropDown';
    calendarDiv.appendChild(yearPicker);


    var img = document.createElement('IMG');
    img.src = pathToImages + 'cal_close.gif';
    img.style.styleFloat = 'right';
    img.onmouseover = highlightClose;
    img.onmouseout = highlightClose;
    img.onclick = closeCalendar;
    topBar.appendChild(img);
    if (!document.all) {
        img.style.position = 'absolute';
        img.style.right = '2px';
    }



}

function writeCalendarContent() {
    var calendarContentDivExists = true;
    if (!calendarContentDiv) {
        calendarContentDiv = document.createElement('DIV');
        calendarDiv.appendChild(calendarContentDiv);
        calendarContentDivExists = false;
    }
    currentMonth = currentMonth / 1;
    var d = new Date();

    d.setFullYear(currentYear);
    d.setDate(1);
    d.setMonth(currentMonth);

    var dayStartOfMonth = d.getDay();
    if (dayStartOfMonth == 0) dayStartOfMonth = 7;
    dayStartOfMonth - 2;

    document.getElementById('calendar_year_txt').innerHTML = currentYear;
    document.getElementById('calendar_month_txt').innerHTML = monthArray[currentMonth];
    //document.getElementById('calendar_hour_txt').innerHTML = currentHour;
    //document.getElementById('calendar_minute_txt').innerHTML = currentMinute;

    var existingTable = calendarContentDiv.getElementsByTagName('TABLE');
    if (existingTable.length > 0) {
        calendarContentDiv.removeChild(existingTable[0]);
    }

    var calTable = document.createElement('TABLE');
    calTable.cellSpacing = '0';
    calendarContentDiv.appendChild(calTable);
    var calTBody = document.createElement('TBODY');
    calTable.appendChild(calTBody);
    var row = calTBody.insertRow(-1);
    var cell = row.insertCell(-1);
    //cell.innerHTML = weekString;
    //cell.style.backgroundColor = selectBoxRolloverBgColor;

    for (var no = 0; no < dayArray.length; no++) {
        var cell = row.insertCell(-1);
        cell.innerHTML = dayArray[no];
    }

    var row = calTBody.insertRow(-1);
    var cell = row.insertCell(-1);
    //cell.style.backgroundColor = selectBoxRolloverBgColor;
    //var week = getWeek(currentYear,currentMonth,1);
    //cell.innerHTML = week;		// Week
    for (var no = 0; no < dayStartOfMonth; no++) {
        var cell = row.insertCell(-1);
        cell.innerHTML = '&nbsp;';
    }

    var colCounter = dayStartOfMonth;
    var daysInMonth = daysInMonthArray[currentMonth];
    if (daysInMonth == 28) {
        if (isLeapYear(currentYear)) daysInMonth = 29;
    }

    for (var no = 1; no <= daysInMonth; no++) {
        d.setDate(no - 1);
        if (colCounter > 0 && colCounter % 7 == 0) {
            var row = calTBody.insertRow(-1);
            var cell = row.insertCell(-1);
            //var week = getWeek(currentYear,currentMonth,no);
            //cell.innerHTML = week;		// Week	
            //cell.style.backgroundColor = selectBoxRolloverBgColor;			
        }
        var cell = row.insertCell(-1);
        if (currentYear == inputYear && currentMonth == inputMonth && no == inputDay) {
            cell.className = 'activeDay';
        }
        cell.innerHTML = no;
        cell.onclick = pickDate;
        colCounter++;
    }


    if (!document.all) {
        if (calendarContentDiv.offsetHeight)
            document.getElementById('topBar').style.top = calendarContentDiv.offsetHeight + document.getElementById('topBar').offsetHeight - 1 + 'px';
        else {
            document.getElementById('topBar').style.top = '';
            document.getElementById('topBar').style.bottom = '0px';
        }

    }

    if (iframeObj) {
        if (!calendarContentDivExists) setTimeout('resizeIframe()', 350); else setTimeout('resizeIframe()', 10);
    }


}

function resizeIframe() {
    if (iframeObj) {
        iframeObj.style.width = calendarDiv.offsetWidth + 'px';
        iframeObj.style.height = calendarDiv.offsetHeight + 'px';
    }
}

function pickTodaysDate() {
    var d = new Date();
    currentMonth = d.getMonth();
    currentYear = d.getFullYear();
    pickDate(false, d.getDate());

}

function pickDate(e, inputDay) {
    var month = currentMonth / 1 + 1;
    if (month < 10) month = '0' + month;
    var day;
    if (!inputDay && this) day = this.innerHTML; else day = inputDay;

    if (day / 1 < 10) day = '0' + day;
    if (returnFormat) {
        returnFormat = returnFormat.replace('dd', day);
        returnFormat = returnFormat.replace('mm', month);
        returnFormat = returnFormat.replace('yyyy', currentYear);
        returnFormat = returnFormat.replace('hh', currentHour);
        returnFormat = returnFormat.replace('ii', currentMinute);
        returnFormat = returnFormat.replace('d', day / 1);
        returnFormat = returnFormat.replace('m', month / 1);
        returnDateTo.value = returnFormat;
        returnDateTo.focus();


    } else {
        for (var no = 0; no < returnDateToYear.options.length; no++) {
            if (returnDateToYear.options[no].value == currentYear) {
                returnDateToYear.selectedIndex = no;
                break;
            }
        }
        for (var no = 0; no < returnDateToMonth.options.length; no++) {
            if (returnDateToMonth.options[no].value == month) {
                returnDateToMonth.selectedIndex = no;
                break;
            }
        }
        for (var no = 0; no < returnDateToDay.options.length; no++) {
            if (returnDateToDay.options[no].value == day) {
                returnDateToDay.selectedIndex = no;
                break;
            }
        }

        if (calendarDisplayTime) {
            for (var no = 0; no < returnDateToHour.options.length; no++) {
                if (returnDateToHour.options[no].value == currentHour) {
                    returnDateToHour.selectedIndex = no;
                    break;
                }
            }
            for (var no = 0; no < returnDateToMinute.options.length; no++) {
                if (returnDateToMinute.options[no].value == currentMinute) {
                    returnDateToMinute.selectedIndex = no;
                    break;
                }
            }



        }



    }
    closeCalendar();

}

// This function is from http://www.codeproject.com/csharp/gregorianwknum.asp
// Only changed the month add
function getWeek(year, month, day) {
    day = day / 1;
    year = year / 1;
    month = month / 1 + 1; //use 1-12
    var a = Math.floor((14 - (month)) / 12);
    var y = year + 4800 - a;
    var m = (month) + (12 * a) - 3;
    var jd = day + Math.floor(((153 * m) + 2) / 5) +
                 (365 * y) + Math.floor(y / 4) - Math.floor(y / 100) +
                 Math.floor(y / 400) - 32045;      // (gregorian calendar)
    var d4 = (jd + 31741 - (jd % 7)) % 146097 % 36524 % 1461;
    var L = Math.floor(d4 / 1460);
    var d1 = ((d4 - L) % 365) + L;
    NumberOfWeek = Math.floor(d1 / 7) + 1;
    return NumberOfWeek;
}

function writeTimeBar() {
    var timeBar = document.createElement('DIV');
    timeBar.id = 'timeBar';
    timeBar.className = 'timeBar';

    var subDiv = document.createElement('DIV');
    subDiv.innerHTML = 'Time:';
    //timeBar.appendChild(subDiv);

    // Year selector
    var hourDiv = document.createElement('DIV');
    hourDiv.onmouseover = highlightSelect;
    hourDiv.onmouseout = highlightSelect;
    hourDiv.onclick = showHourDropDown;
    hourDiv.style.width = '30px';
    var span = document.createElement('SPAN');
    span.innerHTML = currentHour;
    span.id = 'calendar_hour_txt';
    hourDiv.appendChild(span);
    timeBar.appendChild(hourDiv);

    var img = document.createElement('IMG');
    img.src = pathToImages + 'cal_down_time.gif';
    hourDiv.appendChild(img);
    hourDiv.className = 'selectBoxTime';

    if (Opera) {
        hourDiv.style.width = '30px';
        img.style.cssText = 'float:right';
        img.style.position = 'relative';
        img.style.styleFloat = 'right';
    }

    var hourPicker = createHourDiv();
    hourPicker.style.left = '130px';
    //hourPicker.style.top = monthDiv.offsetTop + monthDiv.offsetHeight + 1 + 'px';
    hourPicker.style.width = '35px';
    hourPicker.id = 'hourDropDown';
    calendarDiv.appendChild(hourPicker);

    // Add Minute picker

    // Year selector
    var minuteDiv = document.createElement('DIV');
    minuteDiv.onmouseover = highlightSelect;
    minuteDiv.onmouseout = highlightSelect;
    minuteDiv.onclick = showMinuteDropDown;
    minuteDiv.style.width = '30px';
    var span = document.createElement('SPAN');
    span.innerHTML = currentMinute;

    span.id = 'calendar_minute_txt';
    minuteDiv.appendChild(span);
    timeBar.appendChild(minuteDiv);

    var img = document.createElement('IMG');
    img.src = pathToImages + 'cal_down_time.gif';
    minuteDiv.appendChild(img);
    minuteDiv.className = 'selectBoxTime';

    if (Opera) {
        minuteDiv.style.width = '30px';
        img.style.cssText = 'float:right';
        img.style.position = 'relative';
        img.style.styleFloat = 'right';
    }

    var minutePicker = createMinuteDiv();
    minutePicker.style.left = '167px';
    //minutePicker.style.top = monthDiv.offsetTop + monthDiv.offsetHeight + 1 + 'px';
    minutePicker.style.width = '35px';
    minutePicker.id = 'minuteDropDown';
    calendarDiv.appendChild(minutePicker);


    return timeBar;

}

function writeBottomBar() {
    var d = new Date();
    var bottomBar = document.createElement('DIV');

    bottomBar.id = 'bottomBar';

    bottomBar.style.cursor = 'pointer';
    bottomBar.className = 'todaysDate';
    var todayStringFormat = '[todayString] [dayString] [day] [monthString] [year]';;;

    var subDiv = document.createElement('DIV');
    subDiv.onclick = pickTodaysDate;
    subDiv.id = 'todaysDateString';
    subDiv.style.width = (calendarDiv.offsetWidth - 20) + 'px';
    var day = d.getDay();
    if (day == 0) day = 1;
    day - 2;

    var bottomString = todayStringFormat;
    bottomString = bottomString.replace('[monthString]', monthArrayShort[d.getMonth()]);
    bottomString = bottomString.replace('[day]', d.getDate());
    bottomString = bottomString.replace('[year]', d.getFullYear());
    bottomString = bottomString.replace('[dayString]', dayArray[day].toLowerCase());
    bottomString = bottomString.replace('[UCFdayString]', dayArray[day]);
    bottomString = bottomString.replace('[todayString]', todayString);


    subDiv.innerHTML = todayString + ': ' + d.getDate() + '. ' + monthArrayShort[d.getMonth()] + ', ' + d.getFullYear();
    subDiv.innerHTML = bottomString;
    bottomBar.appendChild(subDiv);

    //var timeDiv = writeTimeBar();
    //bottomBar.appendChild(timeDiv);

    calendarDiv.appendChild(bottomBar);


}
function getTopPos(inputObj) {

    var returnValue = inputObj.offsetTop + inputObj.offsetHeight;
    while ((inputObj = inputObj.offsetParent) != null) returnValue += inputObj.offsetTop;
    return returnValue + calendar_offsetTop;
}

function getleftPos(inputObj) {
    var returnValue = inputObj.offsetLeft;
    while ((inputObj = inputObj.offsetParent) != null) returnValue += inputObj.offsetLeft;
    return returnValue + calendar_offsetLeft;
}

function positionCalendar(inputObj) {
    var leftclick = getleftPos(inputObj);
    var topclick = getTopPos(inputObj);
    var windowwidth = document.body.clientWidth;
    var windowheight = document.body.clientHeight;

    if (windowheight == 0) {
        if (typeof document.documentElement.clientHeight != 'undefined') {
            windowheight = document.documentElement.clientHeight;
        }
    }

    var scrolltop = document.body.scrollTop;
    var scrollleft = document.body.scrollLeft;

    if ((leftclick - scrollleft + 190) > windowwidth) {
        calendarDiv.style.left = (windowwidth + scrollleft - 200) + 'px';
    }
    else {
        calendarDiv.style.left = leftclick + 'px';
    }
    if ((topclick - scrolltop + 170) > windowheight) {
        calendarDiv.style.top = (windowheight + scrolltop - 180) + 'px';
    }
    else {
        calendarDiv.style.top = topclick + 'px';
    }

    if (iframeObj) {
        iframeObj.style.left = calendarDiv.style.left;
        iframeObj.style.top = calendarDiv.style.top;
    }

}

function initCalendar() {
    /*if(MSIE){
		iframeObj = document.createElement('IFRAME');
		iframeObj.style.position = 'absolute';
		iframeObj.border='0px';
		iframeObj.style.border = '0px';
		iframeObj.style.backgroundColor = '#FF0000';
		document.body.appendChild(iframeObj);
	}*/

    calendarDiv = document.createElement('DIV');
    calendarDiv.id = 'calendarDiv';

    calendarDiv.style.zIndex = 1000;
    slideCalendarSelectBox();

    document.body.appendChild(calendarDiv);
    writeBottomBar();
    writeTopBar();



    if (!currentYear) {
        var d = new Date();
        currentMonth = d.getMonth();
        currentYear = d.getFullYear();
    }
    writeCalendarContent();



}

function setTimeProperties() {
    if (!calendarDisplayTime) {
        //document.getElementById('timeBar').style.display='none'; 
        //document.getElementById('timeBar').style.visibility='hidden'; 
        //document.getElementById('todaysDateString').style.width = '100%';


    } else {
        //document.getElementById('timeBar').style.display='block';
        document.getElementById('timeBar').style.visibility = 'visible';
        document.getElementById('hourDropDown').style.top = document.getElementById('calendar_minute_txt').parentNode.offsetHeight + calendarContentDiv.offsetHeight + document.getElementById('topBar').offsetHeight + 'px';
        document.getElementById('minuteDropDown').style.top = document.getElementById('calendar_minute_txt').parentNode.offsetHeight + calendarContentDiv.offsetHeight + document.getElementById('topBar').offsetHeight + 'px';
        document.getElementById('minuteDropDown').style.right = '50px';
        document.getElementById('hourDropDown').style.right = '50px';
        //document.getElementById('todaysDateString').style.width = '115px';
    }
}

function calendarSortItems(a, b) {
    return a / 1 - b / 1;
}


function __displayCalendar(inputField, format, buttonObj, displayTime, timeInput) {



    __Calendar_HideWebEditPro();

    __createDCDivIfNotPresent();

    var dateType = "1";
    try {
        if (vdateFormat) {
            dateType = vdateFormat;
        }
    } catch (err) { }

    if (dateType == "1") {
        format = "mm/dd/yyyy";
    }
    else {
        format = "dd/mm/yyyy";
    }

    if (displayTime) calendarDisplayTime = true; else calendarDisplayTime = false;

    var inputValue = inputField.value;

    if (dateType == "2") {

        if (checkDDMMYYY(inputField, "N") == false) {
            inputValue = "";
        }

    }
    else {
        if (__checkDate(inputValue) == false) {
            inputValue = "";
        }
    }

    if (inputValue.length > 0) {

        if (!format.match(/^[0-9]*?$/gi)) {
            var items = inputValue.split(/[^0-9]/gi);
            var positionArray = new Array();
            positionArray['m'] = format.indexOf('mm');
            if (positionArray['m'] == -1) positionArray['m'] = format.indexOf('m');
            positionArray['d'] = format.indexOf('dd');
            if (positionArray['d'] == -1) positionArray['d'] = format.indexOf('d');
            positionArray['y'] = format.indexOf('yyyy');
            positionArray['h'] = format.indexOf('hh');
            positionArray['i'] = format.indexOf('ii');

            var positionArrayNumeric = Array();
            positionArrayNumeric[0] = positionArray['m'];
            positionArrayNumeric[1] = positionArray['d'];
            positionArrayNumeric[2] = positionArray['y'];
            positionArrayNumeric[3] = positionArray['h'];
            positionArrayNumeric[4] = positionArray['i'];


            positionArrayNumeric = positionArrayNumeric.sort(calendarSortItems);
            var itemIndex = -1;
            currentHour = '00';
            currentMinute = '00';
            for (var no = 0; no < positionArrayNumeric.length; no++) {
                if (positionArrayNumeric[no] == -1) continue;
                itemIndex++;
                if (positionArrayNumeric[no] == positionArray['m']) {
                    currentMonth = items[itemIndex] - 1;
                    continue;
                }
                if (positionArrayNumeric[no] == positionArray['y']) {
                    currentYear = items[itemIndex];
                    continue;
                }
                if (positionArrayNumeric[no] == positionArray['d']) {
                    tmpDay = items[itemIndex];
                    continue;
                }
                if (positionArrayNumeric[no] == positionArray['h']) {
                    currentHour = items[itemIndex];
                    continue;
                }
                if (positionArrayNumeric[no] == positionArray['i']) {
                    currentMinute = items[itemIndex];
                    continue;
                }
            }

            currentMonth = currentMonth / 1;
            tmpDay = tmpDay / 1;

        } else {
            var monthPos = format.indexOf('mm');
            currentMonth = inputValue.substr(monthPos, 2) / 1 - 1;
            var yearPos = format.indexOf('yyyy');
            currentYear = inputValue.substr(yearPos, 4);
            var dayPos = format.indexOf('dd');
            tmpDay = inputValue.substr(dayPos, 2);

            var hourPos = format.indexOf('hh');
            if (hourPos >= 0) {
                tmpHour = inputValue.substr(hourPos, 2);
                currentHour = tmpHour;
            } else {
                currentHour = '00';
            }
            var minutePos = format.indexOf('ii');
            if (minutePos >= 0) {
                tmpMinute = inputValue.substr(minutePos, 2);
                currentMinute = tmpMinute;
            } else {
                currentMinute = '00';
            }
        }
    } else {
        var d = new Date();
        currentMonth = d.getMonth();
        currentYear = d.getFullYear();
        currentHour = '08';
        currentMinute = '00';
        tmpDay = d.getDate();
    }

    inputYear = currentYear;
    inputMonth = currentMonth;
    inputDay = tmpDay / 1;

    var blnShowCalendar = true;

    if (!calendarDiv) {
        //alert('show');
        initCalendar();
        blnShowCalendar = true;
    }
    else {
        if (calendarDiv.style.display == 'block') {
            //alert('hide');
            closeCalendar();
            //return false;
            blnShowCalendar = false;
        }
        writeCalendarContent();
    }

    if (blnShowCalendar == true) {
        returnFormat = format;
        returnDateTo = inputField;
        positionCalendar(buttonObj);
        calendarDiv.style.visibility = 'visible';
        calendarDiv.style.display = 'block';
        if (iframeObj) {
            iframeObj.style.display = '';
            iframeObj.style.height = '120px';
            iframeObj.style.width = '195px';
        }

        //setTimeProperties();	
        updateYearDiv();
        updateMonthDiv();
        //updateMinuteDiv();
        //updateHourDiv();

        if (MSIE) {
            if (document.getElementById("dvCalculator").style.visibility == 'visible') {
                document.getElementById("DCcboOperand").style.visibility = 'hidden';
                document.getElementById("DCcboDays").style.visibility = 'hidden';
            }
            else {
                __hideSelect("calendarDiv");
            }
        }
    }

}

function displayCalendarSelectBox(yearInput, monthInput, dayInput, hourInput, minuteInput, buttonObj) {
    if (!hourInput) calendarDisplayTime = false; else calendarDisplayTime = true;

    currentMonth = monthInput.options[monthInput.selectedIndex].value / 1 - 1;
    currentYear = yearInput.options[yearInput.selectedIndex].value;
    if (hourInput) {
        currentHour = hourInput.options[hourInput.selectedIndex].value;
        inputHour = currentHour / 1;
    }
    if (minuteInput) {
        currentMinute = minuteInput.options[minuteInput.selectedIndex].value;
        inputMinute = currentMinute / 1;
    }

    inputYear = yearInput.options[yearInput.selectedIndex].value;
    inputMonth = monthInput.options[monthInput.selectedIndex].value / 1 - 1;
    inputDay = dayInput.options[dayInput.selectedIndex].value / 1;

    if (!calendarDiv) {
        initCalendar();
    } else {
        writeCalendarContent();
    }



    returnDateToYear = yearInput;
    returnDateToMonth = monthInput;
    returnDateToDay = dayInput;
    returnDateToHour = hourInput;
    returnDateToMinute = minuteInput;




    returnFormat = false;
    returnDateTo = false;
    positionCalendar(buttonObj);
    calendarDiv.style.visibility = 'visible';
    calendarDiv.style.display = 'block';
    if (iframeObj) {
        iframeObj.style.display = '';
        iframeObj.style.height = calendarDiv.offsetHeight + 'px';
        iframeObj.style.width = calendarDiv.offsetWidth + 'px';
    }
    setTimeProperties();
    updateYearDiv();
    updateMonthDiv();
    updateHourDiv();
    updateMinuteDiv();

}

function __checkDate(datevalue) {
    datevalue = datevalue.replace(/^\s+/, "");

    datevalue = datevalue.replace(/\s+$/, "");

    msg = "Please Enter Valid Date (mm/dd/yyyy) or (mm-dd-yyyy) ";
    if (datevalue.length == 8) {
        month = datevalue.substr(0, 1);
        day = datevalue.substr(2, 1);
        year = datevalue.substr(4, 4);
    }
    else if (datevalue.length == 9) {
        if (datevalue.charAt(2) == "/" || datevalue.charAt(2) == "-") {
            month = datevalue.substr(0, 2);
            day = datevalue.substr(3, 1);
            year = datevalue.substr(5, 4);
        }
        else if (datevalue.charAt(1) == "/" || datevalue.charAt(1) == "-") {
            month = datevalue.substr(0, 1);
            day = datevalue.substr(2, 2);
            year = datevalue.substr(5, 4);
        }
    }
    else if (datevalue.length == 10) {
        month = datevalue.substr(0, 2);
        day = datevalue.substr(3, 2);
        year = datevalue.substr(6, 4);
    }
    if (datevalue != "") {
        if (datevalue.indexOf(".") != -1) {
            return false;
        }
        if (datevalue.length != 8 && datevalue.length != 9 && datevalue.length != 10) {
            return false;
        }
        if (datevalue.length == 8) {
            if (!(datevalue.charAt(1) == "/" && datevalue.charAt(3) == "/") && !(datevalue.charAt(1) == "-" && datevalue.charAt(3) == "-")) {
                return false;
            }
        }
        else if (datevalue.length == 9) {
            if (!(datevalue.charAt(2) == "/" && datevalue.charAt(4) == "/") && !(datevalue.charAt(1) == "/" && datevalue.charAt(4) == "/") && !(datevalue.charAt(2) == "-" && datevalue.charAt(4) == "-") && !(datevalue.charAt(1) == "-" && datevalue.charAt(4) == "-")) {
                return false;
            }
        }
        else if (datevalue.length == 10) {
            if (!(datevalue.charAt(2) == "/" && datevalue.charAt(5) == "/") && !(datevalue.charAt(2) == "-" && datevalue.charAt(5) == "-")) {
                return false;
            }
        }
        if (isNaN(day)) {
            return false;
        }
        if (isNaN(month)) {
            return false;
        }
        else {
            if (month > 12 || month <= 0) {
                return false;
            }
            else if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
                if ((day > 30) || (day <= 0)) {
                    return false;
                }
            }
            else {
                if ((day > 31) || (day <= 0)) {
                    return false;
                }
            }
        }
        if (!isNaN(year)) {
            if (year < 1753) {
                return false;
            }
            if (month == 2) {
                if ((year % 4 == 0) && (day > 29)) {
                    return false;
                }
                if ((year % 4 != 0) && (day > 28)) {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    }
    return true;
}

//hide dropdown so menu can cover it when menu is visible
function __hideSelect(menuID) {
    var obj;
    var currentEle;
    var top = 0;
    var left = 0;
    var menuHeight;
    var timeout;
    var activeHeader = null;
    var activeMenu = null;

    //activeHeader = eval("document.all('" + menuHeaderID + "');");
    activeMenu = eval("document.all('" + menuID + "');");

    for (var i = 0; i < document.all.tags("select").length; i++) {
        obj = document.all.tags("select")[i];
        currentEle = obj;

        while (currentEle.tagName.toLowerCase() != 'body') {
            top += currentEle.offsetTop;
            left += currentEle.offsetLeft;
            currentEle = currentEle.offsetParent;
        }
        if (activeMenu != null) {
            menuHeight = (activeMenu.offsetTop + activeMenu.offsetHeight);

            if (top < menuHeight) {
                if ((left < (activeMenu.offsetLeft + activeMenu.offsetWidth)) && (left + obj.offsetWidth > activeMenu.offsetLeft))
                    obj.style.visibility = 'hidden';
            }
        }
        top = 0;
        left = 0;
    }
}
//show dropdown when menu is hidden
function __showSelect() {
    var obj;

    for (var i = 0; i < document.all.tags("select").length; i++) {
        obj = document.all.tags("select")[i];
        //alert(obj.id);
        if (!obj || !obj.offsetParent)
            continue;
        obj.style.visibility = 'visible';
    }
}

//------------------------------Date Calculator--------------------//

var __blnDCSHow = false;
var __DCxmlHttp;
var __DCis_ie = (navigator.userAgent.indexOf('MSIE') >= 0) ? 1 : 0;
var __DCis_ie5 = (navigator.appVersion.indexOf("MSIE 5.5") != -1) ? 1 : 0;
var __DCis_opera = ((navigator.userAgent.indexOf("Opera6") != -1) || (navigator.userAgent.indexOf("Opera/6") != -1)) ? 1 : 0;
//netscape, safari, mozilla behave the same??? 
var __DCis_netscape = (navigator.userAgent.indexOf('Netscape') >= 0) ? 1 : 0;
var __DCDateField;
var __DCImageObject;

function __DCshowDateCalculator(datefield, dcimageobject) {
    isCalculatorOpen = true;
    __Calendar_HideWebEditPro();

    __createDCDivIfNotPresent();

    __DCDateField = datefield;
    __DCImageObject = dcimageobject

    __DCShowHideDiv();

    //Append the name to search for to the i_requestURL 
    var url = "../Corpinclude/inc_date_calculator.html";

    //Create the __DCxmlHttp object to use in the request 
    //__DCstateChangeHandler will fire when the state has changed, i.e. data is received back 
    // This is non-blocking (asynchronous) 
    __DCxmlHttp = __DCGetXmlHttpObject(__DCstateChangeHandler);

    //Send the __DCxmlHttp get to the specified url 
    __DCxmlHttp_Get(__DCxmlHttp, url);

}

//__DCstateChangeHandler will fire when the state has changed, i.e. data is received back 
// This is non-blocking (asynchronous) 
function __DCstateChangeHandler() {
    //readyState of 4 or 'complete' represents that data has been returned 
    if (__DCxmlHttp.readyState == 4 || __DCxmlHttp.readyState == 'complete') {
        //Gather the results from the callback 
        var __DCtext = __DCxmlHttp.responseText;

        //Populate the innerHTML of the div with the results 
        document.getElementById('dvCalculator').innerHTML = __DCtext;

        if (document.getElementById(__DCDateField)) {
            document.getElementById("DCtxtDate").value = document.getElementById(__DCDateField).value
        } else if (__DCDateField) {
            document.getElementById("DCtxtDate").value = __DCDateField.value
        }

        if (__blnDCSHow == false) {
            document.getElementById('DCcboOperand').style.display = 'none';
            document.getElementById('DCcboDays').style.display = 'none';
        }
        else {
            if (document.getElementById("calendarDiv")) {
                closeCalendar();
            }
            document.getElementById('DCcboOperand').style.display = 'block';
            document.getElementById('DCcboDays').style.display = 'block';
            positionDateCalculator(__DCImageObject);
        }

    }
}

// __DCxmlHttp send GET request 
function __DCxmlHttp_Get(__DCxmlHttp, url) {
    __DCxmlHttp.open('GET', url, true);
    __DCxmlHttp.send(null);
}

function __DCGetXmlHttpObject(handler) {
    var objXmlHttp = null;    //Holds the local __DCxmlHttp object instance 

    //Depending on the browser, try to create the __DCxmlHttp object 
    if (__DCis_ie) {
        //The object to create depends on version of IE 
        //If it isn't ie5, then default to the Msxml2.xmlHttp object 
        var strObjName = (__DCis_ie5) ? 'Microsoft.xmlHttp' : 'Msxml2.xmlHttp';

        //Attempt to create the object 
        try {
            objXmlHttp = new ActiveXObject(strObjName);
            objXmlHttp.onreadystatechange = handler;
        }
        catch (e) {
            //Object creation errored 
            alert('IE detected, but object could not be created. Verify that active scripting and activeX controls are enabled');
            return;
        }
    }
    else if (__DCis_opera) {
        //Opera has some issues with __DCxmlHttp object functionality 
        alert('Opera detected. The page may not behave as expected.');
        return;
    }
    else {
        // Mozilla | Netscape | Safari 
        objXmlHttp = new XMLHttpRequest();
        objXmlHttp.onload = handler;
        objXmlHttp.onerror = handler;
    }

    //Return the instantiated object 
    return objXmlHttp;
}
function DCcheckFloat(val) {
    for (var i = 0; i < val.length; i++) {

        var lchar = val.charAt(i)

        if (lchar == ".") {
            return -1;
        }
    }
    return 0;
}

function __DCCopyToDateField(i_strField) {

    var dateType = "1";
    try {
        if (vdateFormat)
            dateType = vdateFormat;
    } catch (err) { }

    if (dateType == "2") {
        if (checkDDMMYYY(i_strField, "N") == false) {
            return;
        }
    }
    else {
        if (!(checkDate(i_strField))) {
            return;
        }
    }

    var inputDate = i_strField.value

    if (inputDate != "") {
        __DCClear();
        document.getElementById("DCtxtDate").value = inputDate;
    }
}

function __DCCopyResult() {

    if (!(checkDate(document.getElementById("DCtxtCal")))) {
        return;
    }

    var result = document.getElementById("DCtxtCal").value

    if (result != "") {
        //if (document.getElementById(__DCDateField).readOnly==true)
        //    {
        //    alert("This is a read only field and cannot be edited.");
        //    }
        //else
        //    {
        if (document.getElementById(__DCDateField)) {
            document.getElementById(__DCDateField).value = result;
            document.getElementById(__DCDateField).focus();
        }
        else {
            __DCDateField.value = result;
            __DCDateField.focus();
        }
        //	}
    }
    __DCShowHideDiv();
}

function __DCClear() {
    document.getElementById("DCtxtDate").value = "";
    document.getElementById("DCtxtValue").value = "";
    document.getElementById("DCtxtCal").value = "";
    document.getElementById("DCcboOperand").value = "A";
    document.getElementById("DCcboDays").value = "D";
}

function dateAddsub(p_Interval, p_Number, p_Date) {

    p_Number = new Number(p_Number);
    var dt;// = new Date(p_Date);

    var dateType = "1";
    try {
        if (vdateFormat)
            dateType = vdateFormat;
    } catch (err) { }

    if (dateType == "2") {
        var __day, __month, __year;
        if (p_Date.length == 8) {
            __day = p_Date.substr(0, 1);
            __month = p_Date.substr(2, 1);
            __year = p_Date.substr(4, 4);
        }
        else if (p_Date.length == 9) {
            if (p_Date.charAt(2) == "/" || p_Date.charAt(2) == "-") {
                __day = p_Date.substr(0, 2);
                __month = p_Date.substr(3, 1);
                __year = p_Date.substr(5, 4);
            }
            else if (p_Date.charAt(1) == "/" || p_Date.charAt(1) == "-") {
                __day = p_Date.substr(0, 1);
                __month = p_Date.substr(2, 2);
                __year = p_Date.substr(5, 4);
            }
        }
        else if (p_Date.length == 10) {
            __day = p_Date.substr(0, 2);
            __month = p_Date.substr(3, 2);
            __year = p_Date.substr(6, 9);
        }
        dt = new Date(__month + "/" + __day + "/" + __year);
    }
    else {
        dt = new Date(p_Date);
    }

    switch (p_Interval.toLowerCase()) {
        case "y":
            {
                dt.setFullYear(dt.getFullYear() + p_Number);
                break;
            }
        case "m":
            {
                dt.setMonth(dt.getMonth() + p_Number);
                break;
            }
        case "d":
            {
                dt.setDate(dt.getDate() + p_Number);
                break;
            }



    }

    if (dt.getDate() >= '0' && dt.getMonth() >= '0' && dt.getFullYear() >= '0') {
        if (dateType == "2") {
        return (dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear());
        }
        else {
        return ((dt.getMonth() + 1) + "/" + dt.getDate() + "/" + dt.getFullYear());
        }
    }
    else {
        alert("Please Enter Valid Number");
        return '';
    }
}


function __DCVerify() {
    var operand = document.getElementById("DCcboOperand").value;
    var inputDate = document.getElementById("DCtxtDate").value;
    var p_Number = document.getElementById("DCtxtValue").value;
    var inputType = document.getElementById("DCcboDays").value;
    var result = document.getElementById("DCtxtCal");

    if (strim(inputDate) == "") {
        alert("Please Enter Date Field");
        return false;
    }

    if (strim(p_Number) == "") {
        alert("Please Enter the Number");
        return false;
    }
    if (isNaN(p_Number)) {
        alert("Please Enter the Number")
        return false;
    }


    if (parseInt(p_Number) < 0) {
        alert("Please Enter the Real Number")
        return false;
    }

    if (DCcheckFloat(p_Number) == -1) {
        alert("Please Enter Positive Non-Decimal Number")
        return false;
    }

    if (!(checkDate(document.getElementById("DCtxtDate")))) {
        return false;
    }


    if (operand == "A") {
        switch (inputType) {
            case "D":
                result.value = dateAddsub("d", p_Number, inputDate)
                break;
            case "M":
                result.value = dateAddsub("m", p_Number, inputDate)
                break;
            case "Y":
                result.value = dateAddsub("y", p_Number, inputDate)
                break;
        }
    }
    else {
        switch (inputType) {
            case "D":
                result.value = dateAddsub("d", -(p_Number), inputDate)
                break;
            case "M":
                result.value = dateAddsub("m", -(p_Number), inputDate)
                break;
            case "Y":
                result.value = dateAddsub("y", -(p_Number), inputDate)
                break;
        }
    }
}


function __DCShowHideDiv() {
    //alert(__blnDCSHow);
    if (__blnDCSHow == false) {
        __blnDCSHow = true;
        document.getElementById("dvCalculator").style.visibility = 'visible';
        if (__DCis_ie == 1) {
            __hideSelect("dvCalculator");
        }
    }
    else {
        isCalculatorOpen = false;
        __Calendar_ShowWebEditPro();
        __blnDCSHow = false;
        document.getElementById("dvCalculator").style.visibility = 'hidden';
        document.getElementById('DCcboOperand').style.display = 'none';
        document.getElementById('DCcboDays').style.display = 'none';
        if (__DCis_ie == 1) {
            __showSelect();
        }
    }
}



function positionDateCalculator(inputObj) {
    var leftclick = getleftPos(inputObj);
    var topclick = getTopPos(inputObj);
    var windowwidth = document.body.clientWidth;
    var windowheight = document.body.clientHeight;

    if (windowheight == 0) {
        if (typeof document.documentElement.clientHeight != 'undefined') {
            windowheight = document.documentElement.clientHeight;
        }
    }

    var scrolltop = document.body.scrollTop;
    var scrollleft = document.body.scrollLeft;
    var DCDiv = document.getElementById("dvCalculator");

    if ((leftclick - scrollleft + 190) > windowwidth) {
        DCDiv.style.left = (windowwidth + scrollleft - 200) + 'px';
    }
    else {
        DCDiv.style.left = leftclick + 'px';
    }
    if ((topclick - scrolltop + 200) > windowheight) {
        DCDiv.style.top = (windowheight + scrolltop - 210) + 'px';
    }
    else {
        DCDiv.style.top = topclick + 'px';
    }

}

function __createDCDivIfNotPresent() {
    if (!document.getElementById("dvCalculator")) {
        var dcDiv = document.createElement('DIV');
        dcDiv.id = 'dvCalculator';
        dcDiv.style.zIndex = 1000;
        dcDiv.style.position = "absolute";
        dcDiv.style.visibility = 'hidden';
        document.body.appendChild(dcDiv);
    }
}
//--------------------------------------------------------------------------------//




// ******** Added by Taher :: To hide EwebEditPro while showing Calendar *************//

var isCalculatorOpen = false;
function __Calendar_HideWebEditPro() {
    var arrObj = document.getElementsByTagName("object");
    for (var i = 0; i < arrObj.length; i++) {
        arrObj[i].style.display = 'none';
    }
}

function __Calendar_ShowWebEditPro() {
    var arrObj = document.getElementsByTagName("object");
    for (var i = 0; i < arrObj.length; i++) {
        if (!isCalculatorOpen)
            arrObj[i].style.display = 'block';
    }
}


/**************************************************************************************/
