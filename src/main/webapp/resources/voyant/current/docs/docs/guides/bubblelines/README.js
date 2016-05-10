Ext.data.JsonP.bubblelines({"guide":"<h1 id='bubblelines-section-bubblelines'>Bubblelines</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/bubblelines-section-overview'>Overview</a></li>\n<li><a href='#!/guide/bubblelines-section-options'>Options</a></li>\n<li><a href='#!/guide/bubblelines-section-additional-information'>Additional Information</a></li>\n<li><a href='#!/guide/bubblelines-section-see-also'>See Also</a></li>\n</ol>\n</div>\n\n<p>Bubblelines visualizes the frequency and distribution of terms in a corpus.</p>\n\n<h2 id='bubblelines-section-overview'>Overview</h2>\n\n<p>Each document in the corpus is represented as a horizontal line and divided into segments of equal length (50 segments by default). Each selected word is represented as a bubble with the size of the bubble indicating the word’s frequency in the corresponding segment of text. The larger the bubble the more frequently the word occurs.</p>\n\n<p><p><img src=\"guides/bubblelines/bubblelines.png\" alt=\"Bubblelines\" width=\"1547\" height=\"792\"></p></p>\n\n<p>Hovering over a location on the document line will cause a bubble to appear with term frequencies for that segment. At the end of the document line is a label that indicates the count of all terms selected for that document; hovering over the label shows a break-down of the term frequencies for that document.</p>\n\n<p><p><img src=\"guides/bubblelines/bubblelines-counts.png\" alt=\"Bubblelines\" width=\"1547\" height=\"347\"></p></p>\n\n<p>The colour-coded terms are shown under the grey Bubblelines header. You can remove a term by clicking on it and selecting \"Remove Term\".</p>\n\n<h2 id='bubblelines-section-options'>Options</h2>\n\n<p>You can add more terms by using the search box – simply type in a term and hit enter (see <a href=\"#!/guide/search\">Term Searches</a> for more advanced searching capabilities). You can also clear all existing terms.</p>\n\n<p>The \"Segments\" slider allows you to adjust how many segments are used for each document: if you use a value of 10, it means that the document will be divided into 10 equal parts (based on the number of terms in each part). The minimum value is 10 and the maximum value is 300, with incremental jumps of 10.</p>\n\n<p><p><img src=\"guides/bubblelines/segments.png\" alt=\"Segments\" width=\"1543\" height=\"637\"></p></p>\n\n<p>You also have the choice of viewing all the terms from a document on one line, or separating each term on its own line.</p>\n\n<p>Clicking on the <a href=\"#!/guide/options\">Options</a> icon allows you to define a set of stopwords to exclude – see the <a href=\"#!/guide/stopwords\">stopwords guide</a> for more information.</p>\n\n<h2 id='bubblelines-section-additional-information'>Additional Information</h2>\n\n<p>Bubblelines currently doesn't work well with corpora that have many hundreds of documents or more.</p>\n\n<p>Bubblelines was initially designed by Carlos Fiorentino as a student of Stan Ruecker.</p>\n\n<h2 id='bubblelines-section-see-also'>See Also</h2>\n\n<ul>\n<li><a href=\"#!/guide/start\">Getting Started</a></li>\n<li><a href=\"#!/guide/stopwords\">Stopwords</a></li>\n<li><a href=\"#!/guide/search\">Term Searches</a></li>\n<li><a href=\"#!/guide/skins-section-default-skin\">Default Skin</a></li>\n<li><a href=\"#!/guide/tools\">List of Tools</a></li>\n</ul>\n\n","title":"Bubblelines"});