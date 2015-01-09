var state = "index"; // states flag
var contentLoaded = false; // whether the popup with the description of the cards has already been updated with the description of the current card
var tutorialShown = false; // whether the user has seen the tutorial or not

var maxCards = 5; // max number of cards for the player to sort per each lake zone at a time.
var maxIdleTime =2;// minutes

// Chosen cards array
var watershedDeck = [];
var nearshoreDeck = [];
var openwaterDeck = [];
var deepwaterDeck = [];

// Controls the app reseting clock
var t; // time
window.onload = resetTimer;
Zepto(document).bind("tap click", function(){
	resetTimer();
});
// mouse or click events put app out of iddle state
document.onmousemove = resetTimer;
document.onkeypress = resetTimer;


function reloadApp()
{
    window.location.reload();
}

function resetTimer()
{
    clearTimeout(t);
    if(state!="index")
    {
    	t = setTimeout(reloadApp, 1000*60*maxIdleTime);
		//t = setTimeout(reloadApp, 3000);
    }
}

// Ready function
Zepto(document).ready(function()
{
	tutorialShown = false;
	console.log(tutorialShown);

	// Index page, buttom that goes to lake areas map
	Zepto(".btn-explore").bind("click tap", function(){
		goToLakeAreas();
	});
	// Lake areas page, buttom that goes to watershed page
	Zepto(".watershed-btn").bind("click tap", function(){
		goToZone("watershed");
	});
	// Lake areas page, buttom that goes to nearshore page
	Zepto(".nearshore-btn").bind("click tap", function(){
		goToZone("nearshore");
	});
	// Lake areas page, buttom that goes to openwater page
	Zepto(".openwater-btn").bind("click tap", function(){
		goToZone("openwater");
	});
	// Lake areas page, buttom that goes to deepwater page
	Zepto(".deepwater-btn").bind("click tap", function(){
		goToZone("deepwater");
	});

	//Hidden refresh
	Zepto(".explanation").bind("longTap", function(){
		window.location.reload();
	});

	Zepto("#tutorial-close").bind("click tap", function(){
		Zepto(".tutorial").fadeOut(800);
	});

	// Buttoms that go back to home, lake areas map
	var homeBtns = Zepto(".homeBtn");
	Zepto.each(homeBtns, function(){
		Zepto(this).bind("click tap", function(){
			goBackHome();
		});
	});

	// Buttoms that reset the specific lake area cards
	var resetBtns = Zepto(".resetBtn");
	Zepto.each(resetBtns, function(){
		Zepto(this).bind("click longTap", function(){
			resetZone();
		});
	});

	var leftArrows = Zepto(".leftArrow");
	Zepto.each(leftArrows, function(){
		if(this.id=="arrowFadeout")
		{
			defineArrowColor(this);
		}
		else
		{
			Zepto(this).bind("click longTap", function(){
				previousZone();
			});
		}
	});

	var rightArrows = Zepto(".rightArrow");
	Zepto.each(rightArrows, function(){
		if(this.id=="arrowFadeout")
		{
			defineArrowColor(this);
		}
		else
		{
			Zepto(this).bind("click longTap", function(){
				nextZone();
			});
		}
	});

	/* /////////////////////////////////// Cards logic //////////////////////////////////// */

	watershedDeck = pickRandomCards("watershed", maxCards);
	nearshoreDeck = pickRandomCards("nearshore", maxCards);
	openwaterDeck = pickRandomCards("openwater", maxCards);
	deepwaterDeck = pickRandomCards("deepwater", maxCards);

	// Places cards
	placeCards(watershedDeck, "watershed");
	placeCards(nearshoreDeck, "nearshore");
	placeCards(openwaterDeck, "openwater");
	placeCards(deepwaterDeck, "deepwater");


	$('.droppables-wrapper').droppable({
	    accept:'.card',
	    tolerance: 'pointer',

	    drop:function(event,ui) {
	    },
	    out:function(event,ui) {
	    },
	    over:function(event,ui) {
	    }
	});

});

function pickRandomCards(zone, deckSize)
{
	var allCards = [];
	var amountOfCards = 0;

	var chosenCards = [];

	switch(zone)
	{
		case "watershed":
			allCards = Zepto('#watershed-card.card');
		break;

		case "nearshore":
			allCards = Zepto('#nearshore-card.card');
		break;

		case "openwater":
			allCards = Zepto('#openwater-card.card');
		break;

		case "deepwater":
			allCards = Zepto('#deepwater-card.card');
		break;
	}
	amountOfCards = allCards.length;

	Zepto.each( allCards, function(index, obj){
		Zepto(this).removeAttr("style");
		Zepto(this).css("display", "none");
	});

	
	var cardsIn = 0;
	var chosenIds = [];
	if(deckSize>amountOfCards) deckSize = amountOfCards;
	while(cardsIn<deckSize)
	{
		var min = 0;
		var max = amountOfCards-1;
		var randomId = Math.floor(Math.random() * (max- min + 1)) + min;
		//chosenCards.push(newCard);
		//cardsIn++;
		if(simpleSearch(chosenIds, randomId)==false)
		{
			chosenIds.push(randomId);
			//console.log("random: "+randomId);
			cardsIn++;
		}

	}

	/*var chosenCards = [];*/
	for(var i=0; i < chosenIds.length; i++){
		//chosenCards[i] = allCards[chosenIds[i]];
		var id = chosenIds[i];
		var newCard = allCards[id];
		chosenCards.push(newCard);
	};
	return chosenCards;
}

function simpleSearch(array, number)
{
	var foundIt = false;
	for (var i = 0; i < array.length; i++) {
		if(array[i]==number)
		{
			foundIt = true;
			break;
		}
	};
	return foundIt;
}

function placeCards(deck, zone)
{
	// Iterates inside deck (each object is a pair or card and boolean that indicates if the card is dropped or not)
	Zepto.each( deck, function(index, obj){
		//console.log(this);
		//Zepto(obj.card).each(function(index){
			// Put the card in the correct absolute position
			positionCard(this, index);
			// This variable determines whether the card has been dropped or not.
			var dropped = false;
			var hasFirstDropped = false;
			// Adds draggable properties to chosen card
			$(this).draggable({
				revert: 'invalid',
			    helper: 'original',
			    distance: 0,
			    refreshPositions: true,
			    scroll: false,
			    // When you start moving the card
			    start: function(event,ui) {
			    	Zepto(this).css("z-index", "29");
			    	// Shadow effects
			    	Zepto(this).css({
			    		'box-shadow': '5px 5px 20px #111',
			    		'-moz-box-shadow': '5px 5px 20px #111',
			    		'-webkit-box-shadow': '5px 5px 20px #111',
			    		'transition': 'box-shadow .20s',
			    		'-moz-transition': 'box-shadow .20s',
			    		'-webkit-transition': 'box-shadow .20s ease-in-out',
			    	});
			    	// If card has been dropped we scale a little bit
			    	if(dropped==true)
			    	{
				    	Zepto(this).css({
				    		'transform': 'scale(0.75,0.75)',
				    		'transition': 'transform .20s',
				    		'-webkit-transform': 'scale(0.75,0.75)',
				    		'-webkit-transition': '-webkit-transform .20s'

				    	});
			    	}
			    	// Sets the cursos at the center of the card (aprox.)
			    	$(this).draggable({
			    		cursorAt: {
			    			top: Math.round($(this).outerHeight() / 2),
			    			left: Math.round($(this).outerWidth() / 2),
			    		},
			    	});
			    }, // End of START draggable

			    // When we stop dragging the card
			    stop: function(event,ui) {
			    	Zepto(this).css("z-index", "26");
			    	// Removes shadow
			    	Zepto(this).css({
			    		'box-shadow': 'none',
			    		'position': 'absolute',
			    		'-moz-box-shadow': 'none',
			    		'-webkit-box-shadow': 'none',
			    	});
			    	if(hasFirstDropped==true)
			    	{
				    	// Scales down it smoothly
				    	Zepto(this).css({
				    		'transform': 'scale(0.7,0.7)',
				    		'transition': 'transform .20s',
				    		'-webkit-transform': 'scale(0.7,0.7)',
				    		'-webkit-transition': '-webkit-transform .20s'

				    	});
				    	// If this is right before dropping the first time
				    	if(dropped==false)
				    	{
				    		if(contentLoaded==false)
							{
								var thisCard = Zepto(this);
								loadContent(thisCard);
								contentLoaded = true;
							}
				    		// We show the popup
				    		Zepto(".on-top").fadeIn();
				   			Zepto(".on-top").bind("click tap", function(){
				   				Zepto(".on-top").fadeOut();
				   				contentLoaded = false;
				   			});
				    	}
				    	// Sets card as dropped
				    	dropped=true;
				    	// ->>>>> End controller, counters
			    	}
			    	// Fades out the visual feedback of the droppables
			    	Zepto(".left-border").css('box-shadow', 'none');
			    	Zepto(".center-border").css('box-shadow', 'none');
			    	Zepto(".right-border").css('box-shadow', 'none');

			    	Zepto(".header-unhealthy").css('display', 'none');
			    	Zepto(".header-itdepends").css('display', 'none');
			    	Zepto(".header-healthy").css('display', 'none');

			    	Zepto(".left-border").css({
			    		'transition': 'box-shadow .40s',
			    		'-webkit-transition': 'box-shadow .40s',
			    	});
			    	Zepto(".header-unhealthy").css({
			    		'transition': 'display 1s',
			    		'-webkit-transition': 'display 1s',
			    	});
			    	Zepto(".header-itdepends").css({
			    		'transition': 'display 1s',
			    		'-webkit-transition': 'display 1s',
			    	});
			    	Zepto(".header-healthy").css({
			    		'transition': 'display 1s',
			    		'-webkit-transition': 'display 1s',
			    	});
			    	
			    }, // END of STOP draggable

			    // Whenever card moves while you drag
			    drag: function(event,ui){
			    	// Offset distance between the droppable container and card
					var offset = Zepto(this).offset();
					var droppableOffset = 0;
					switch(zone)
					{
						case "watershed":
							droppableOffset = Zepto("#droppable-whatershed.droppables-wrapper").offset();
							break;

						case "nearshore":
							droppableOffset = Zepto("#droppable-nearshore.droppables-wrapper").offset();
							break;

						case "openwater":
							droppableOffset = Zepto("#droppable-openwater.droppables-wrapper").offset();
							break;

						case "deepwater":
							droppableOffset = Zepto("#droppable-deepwater.droppables-wrapper").offset();
							break;
					}
		            var relativeXpos = offset.left - droppableOffset.left;
					var relativeYpos = offset.top - droppableOffset.top;
					// Card is over "unhealthy" valid area
					if(relativeXpos>=-60 && relativeXpos<=160 && relativeYpos>=0 && relativeYpos<=270)
					{
						//console.log("first third");
						Zepto(".left-border").css('box-shadow', 'inset 0.2em 0.2em 0em 0em #D1DB00');
							Zepto(".header-unhealthy").css('display', 'block');
						Zepto(".center-border").css('box-shadow', 'none');
							Zepto(".header-itdepends").css('display', 'none');
						Zepto(".right-border").css('box-shadow', 'none');
							Zepto(".header-healthy").css('display', 'none');

							Zepto(".left-border").css({
								'transition': 'box-shadow .40s',
								'-webkit-transition': 'box-shadow .40s',
							});
							Zepto(".header-unhealthy").css({
								'transition': 'display 1s',
								'-webkit-transition': 'display 1s',
							});
						hasFirstDropped=true;
					}
					// Card is over "it depends" valid area
					else if(relativeXpos>160 && relativeXpos<610 && relativeYpos>=-100 && relativeYpos<=170)
					{
						//console.log("second third");
						Zepto(".left-border").css('box-shadow', 'none');
							Zepto(".header-unhealthy").css('display', 'none');
						Zepto(".center-border").css('box-shadow', 'inset 0em 0.2em #D1DB00');
							Zepto(".header-itdepends").css('display', 'block');
						Zepto(".right-border").css('box-shadow', 'none');
							Zepto(".header-healthy").css('display', 'none');

							Zepto(".center-border").css({
								'transition': 'box-shadow .40s',
								'-webkit-transition': 'box-shadow .40s',
							});
							Zepto(".header-itdepends").css({
								'transition': 'display 1s',
								'-webkit-transition': 'display 1s',
							});
						hasFirstDropped=true;
					}
					// Card is over "healthy" valid area
					else if(relativeXpos>610 && relativeXpos<=820 && relativeYpos>=0 && relativeYpos<=270)
					{
						//console.log("third third");
						Zepto(".left-border").css('box-shadow', 'none');
							Zepto(".header-unhealthy").css('display', 'none');
						Zepto(".center-border").css('box-shadow', 'none');
							Zepto(".header-itdepends").css('display', 'none');
						Zepto(".right-border").css('box-shadow', 'inset -0.2em 0.25em 0.2em -0.1em #D1DB00');
							Zepto(".header-healthy").css('display', 'block');

							Zepto(".right-border").css({
								'transition': 'box-shadow .40s',
								'-webkit-transition': 'box-shadow .40s',
							});
							Zepto(".header-healthy").css({
								'transition': 'display 1s',
								'-webkit-transition': 'display 1s',
							});
						hasFirstDropped=true;
					}
					// Card is over invalid area
					else
					{
						Zepto(".left-border").css('box-shadow', 'none');
						Zepto(".center-border").css('box-shadow', 'none');
						Zepto(".right-border").css('box-shadow', 'none');

						Zepto(".header-unhealthy").css('display', 'none');
						Zepto(".header-itdepends").css('display', 'none');
						Zepto(".header-healthy").css('display', 'none');

						hasFirstDropped=false;
					}
					if(hasFirstDropped==true)
					{
						var popUpHidden = true;
						Zepto(this).bind("doubleTap dblclick", function(){
							if(contentLoaded==false)
							{
								var thisCard = Zepto(this);
								loadContent(thisCard);
								contentLoaded = true;
							}
							Zepto(".on-top").fadeIn(function(){
								popUpHidden = false;
							});
						});
						Zepto(".on-top").bind("click tap", function(){
							if(popUpHidden==false)
							{
								Zepto(".on-top").fadeOut();
								popUpHidden=true;
								contentLoaded = false;
							}
						});
					}
			    }, // End of DRAG draggable
			}); // End of draggable configuration

		//});//End of loop through card objects
	});//End of loop through elements of the deck
	
	// Loads the card content to the pop-up
	function loadContent(thisCard)
	{
		// Card div
		var cardElement = thisCard[0];
		// img, p, and p (hidden-text)
		var pic = cardElement.children[0];
		var title = cardElement.children[1];
		var description = cardElement.children[2];
		// Gets the image url, title text, and description
		var picUrl = Zepto(pic).attr("src");
		var titleContent = title.innerHTML;
		var descriptionContent = description.innerHTML;
		// Gets the target elements (popup)
		Zepto(".popup-title").text(titleContent);
		Zepto(".popup-image").attr("src", picUrl);
		Zepto(".popup-description").text(descriptionContent);
	}
}

// Positions the card in the correct absolute position
function positionCard(cardObj, index)
{
	Zepto(cardObj).css({
		'display': 'block',
		'z-index': 20+index,
		//Picks random number between 48% and 52% and uses as vertical centralization
		'bottom': 40+(Math.floor(Math.random()*(10-(-10)+1)+(-10))),
		//Picks random number between 48% and 52% and uses as vertical centralization
		'left': Math.floor(Math.random()*(52-(48)+1)+(48))+'%',
		'margin-left' : '-153px',
		//Picks random number between -5 and 5 and uses as rotation
		'transform' : 'rotate('+Math.floor(Math.random()*(5-(-5)+1)+(-5))+'deg)',
		'-webkit-transform' : 'rotate('+Math.floor(Math.random()*(5-(-5)+1)+(-5))+'deg)',
	});
}

// Sends from index to lake areas map
function goToLakeAreas()
{
	var indexPage = Zepto(".index-wrapper");
	Zepto(indexPage).fadeOut("fast");
	Zepto(".lakeareas-wrapper").fadeIn(4500);
	state = "lakeAreas";
}

// Goes to any lake zone, given its name
function goToZone(zoneName)
{
	Zepto(".lakeareas-wrapper").fadeOut("fast");
	switch(zoneName){
		case "watershed":
			Zepto(".watershed-wrapper").fadeIn(3000);
			state = "watershed";
			break;

		case "nearshore":
			Zepto(".nearshore-wrapper").fadeIn(3000);
			state = "nearshore";
			break;

		case "openwater":
			Zepto(".openwater-wrapper").fadeIn(3000);
			state = "openwater";
			break;

		case "deepwater":
			Zepto(".deepwater-wrapper").fadeIn(3000);
			state = "deepwater";
			break;
	}
	console.log(tutorialShown);
	if (tutorialShown==false)
	{
		Zepto(".tutorial").fadeIn(800);
		tutorialShown = true;
		//console.log(tutorialShown);
	}

}

// Goes back to the lake areas map
function goBackHome()
{
	switch(state){
		case "watershed":
			Zepto(".watershed-wrapper").fadeOut("medium");
			break;

		case "nearshore":
			Zepto(".nearshore-wrapper").fadeOut("medium");
			break;

		case "openwater":
			Zepto(".openwater-wrapper").fadeOut("medium");
			break;

		case "deepwater":
			Zepto(".deepwater-wrapper").fadeOut("medium");
			break;
	}

	Zepto(".lakeareas-wrapper").fadeIn("medium");
	state = "lakeAreas";
}

// Defines whether the arrow should be enabled or disabled
function defineArrowColor(arrow)
{
	Zepto(arrow).css("opacity", "0.4");
}

// Changes to the previous lake zone
function previousZone()
{
	switch(state){
		case "watershed":
			break;

		case "nearshore":
			Zepto(".nearshore-wrapper").fadeOut("medium");
			Zepto(".watershed-wrapper").fadeIn("medium");
			state = "watershed";
			break;

		case "openwater":
			Zepto(".openwater-wrapper").fadeOut("medium");
			Zepto(".nearshore-wrapper").fadeIn("medium");
			state = "nearshore";
			break;

		case "deepwater":
			Zepto(".deepwater-wrapper").fadeOut("medium");
			Zepto(".openwater-wrapper").fadeIn("medium");
			state = "openwater";
			break;
	}
}

// Changes to the next zone
function nextZone()
{
	switch(state){
		case "watershed":
			Zepto(".watershed-wrapper").fadeOut("medium");
			Zepto(".nearshore-wrapper").fadeIn("medium");
			state = "nearshore";
			break;

		case "nearshore":
			Zepto(".nearshore-wrapper").fadeOut("medium");
			Zepto(".openwater-wrapper").fadeIn("medium");
			state = "openwater";
			break;

		case "openwater":
			Zepto(".openwater-wrapper").fadeOut("medium");
			Zepto(".deepwater-wrapper").fadeIn("medium");
			state = "deepwater";
			break;

		case "deepwater":
			break;
	}
}

function resetZone()
{
	switch(state){
		case "watershed":
			watershedDeck = [];
			watershedDeck = pickRandomCards("watershed", maxCards);
			placeCards(watershedDeck, "watershed");
			break;

		case "nearshore":
			nearshoreDeck = [];
			nearshoreDeck = pickRandomCards("nearshore", maxCards);
			placeCards(nearshoreDeck, "nearshore");
			break;

		case "openwater":
			openwaterDeck = [];
			openwaterDeck = pickRandomCards("openwater", maxCards);
			placeCards(openwaterDeck, "openwater");
			break;

		case "deepwater":
			deepwaterDeck = [];
			deepwaterDeck = pickRandomCards("deepwater", maxCards);
			placeCards(deepwaterDeck, "deepwater");
			break;
	}
}
