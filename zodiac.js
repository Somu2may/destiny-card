/* Original line-art zodiac illustrations: each sign glyph inside a crescent moon frame. */
(function(){
  var GLYPHS = {
    Aries:'M50 80V46M50 46C50 26 31 20 25 34C21 44 29 52 36 49M50 46C50 26 69 20 75 34C79 44 71 52 64 49',
    Taurus:'M27 28C33 46 67 46 73 28M50 46A17 17 0 1 0 50.01 46Z',
    Gemini:'M28 28C44 35 56 35 72 28M28 72C44 65 56 65 72 72M42 32V68M58 32V68',
    Cancer:'M72 38C62 25 36 25 27 40M30 62C40 75 64 75 73 60M36 37A7 7 0 1 0 36.01 37ZM64 49A7 7 0 1 0 64.01 49Z',
    Leo:'M36 48A10 10 0 1 0 36.01 48ZM45 56C40 42 45 26 58 26C72 26 75 42 67 54C60 64 62 75 73 75',
    Virgo:'M24 34V70M24 42C24 31 38 31 38 42V70M38 42C38 31 52 31 52 42V66C52 77 67 79 71 67C73 57 61 53 52 63',
    Libra:'M24 72H76M24 60H39C33 52 36 34 50 34C64 34 67 52 61 60H76',
    Scorpio:'M22 34V68M22 42C22 31 36 31 36 42V68M36 42C36 31 50 31 50 42V66C50 72 55 75 62 75H72M65 68L72 75L65 82',
    Sagittarius:'M28 74L72 28M52 28H72V48M36 50L52 66',
    Capricorn:'M24 30L34 64L44 30V58C44 74 66 77 71 64C74 53 59 46 52 56C47 64 50 76 43 81',
    Aquarius:'M22 44L32 36L42 44L52 36L62 44L72 36L78 40M22 64L32 56L42 64L52 56L62 64L72 56L78 60',
    Pisces:'M30 26C44 40 44 60 30 74M70 26C56 40 56 60 70 74M34 50H66'
  };
  function svg(sign){
    var g = GLYPHS[sign];
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">'+
      '<circle cx="100" cy="100" r="94" fill="none" stroke="#c9a96a" stroke-width="1.6" opacity=".55"/>'+
      '<circle cx="100" cy="100" r="86" fill="none" stroke="#c9a96a" stroke-width=".8" opacity=".35" stroke-dasharray="1.5 5"/>'+
      /* crescent */
      '<path d="M78 22A80 80 0 1 0 78 178A66 66 0 1 1 78 22Z" fill="#c9a96a" opacity=".16" stroke="#c9a96a" stroke-width="1.2"/>'+
      /* small stars */
      '<path d="M156 40l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2z" fill="#efe6d2" opacity=".85"/>'+
      '<circle cx="168" cy="150" r="2" fill="#efe6d2" opacity=".7"/><circle cx="140" cy="172" r="1.4" fill="#efe6d2" opacity=".6"/>'+
      '<g transform="translate(46 42) scale(1.16)"><path d="'+g+'" fill="none" stroke="#e0c58f" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/></g>'+
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  }
  window.ZODIAC = { svg: svg, signs: Object.keys(GLYPHS) };
})();
