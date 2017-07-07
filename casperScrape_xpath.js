var casper = require('casper').create();
var x = require("casper").selectXPath;
var fs = require('fs');
var siteUrl = casper.cli.get(0);
var searchString = casper.cli.get(1);


function sortNumber(a,b) {
    return a - b;
}


casper.start(siteUrl, function() {
    //TO INSPECT AN OBJECT
    //require('utils').dump(var_name); // this prints the json of the object to console.

    //if the sentences list (ul) exists, process
    //xpath: //*[@id="secondary"]/div/ul
    if (casper.exists(x('.//*[@id="secondary"]/div/ul'))){
        // each sentence is a list item (li)
        //    //*[@id="secondary"]/div/ul/li[1]
        //    //*[@id="secondary"]/div/ul/li[2] ..etc
        var dictionary = {};
        for(var i=1;i<100;i++){
            dictionary = {};
            if (casper.exists(x('//*[@id="secondary"]/div/ul/li['+i+']'))) {
                //build the jpn sentence by figuring out where the katakana goes.
                var sentence = casper.getElementInfo(x('//*[@id="secondary"]/div/ul/li['+i+']')).html;
                var jpn = '';
                var eng = '';

                //iterate through the japanese sentence parts list
                var resume_index =0;
                for(var j=1;j<1000;j++){
                    if (casper.exists(x('//*[@id="secondary"]/div/ul/li['+i+']'+'/div[2]/ul/li['+j+']'))) {
                        if (casper.exists(x('//*[@id="secondary"]/div/ul/li['+i+']'+'/div[2]/ul/li['+j+']/span[2]'))) {
                            //jpn = jpn + ' ' + casper.getElementInfo(x('//*[@id="secondary"]/div/ul/li['+i+']'+'/div[2]/ul/li['+j+']/span[2]')).html
                            var part = casper.getElementInfo(x('//*[@id="secondary"]/div/ul/li['+i+']'+'/div[2]/ul/li['+j+']/span[2]')).html;
                            var index = sentence.indexOf(part, resume_index);
                            resume_index = index;
                            dictionary[index] = part;
                            //jpn = jpn + '[' + casper.getElementInfo(x('//*[@id="secondary"]/div/ul/li['+i+']'+'/div[2]/ul/li['+j+']/span[1]')).html + ']'
                            part = casper.getElementInfo(x('//*[@id="secondary"]/div/ul/li['+i+']'+'/div[2]/ul/li['+j+']/span[1]')).html;
                            index = index+1
                            dictionary[index] = '[' + part + ']';
                            resume_index = index;
                        }
                        else{
                            //jpn = jpn + casper.getElementInfo(x('//*[@id="secondary"]/div/ul/li['+i+']'+'/div[2]/ul/li['+j+']/span')).html
                            var part = casper.getElementInfo(x('//*[@id="secondary"]/div/ul/li['+i+']'+'/div[2]/ul/li['+j+']/span')).html;
                            var index = sentence.indexOf(part, resume_index);
                            dictionary[index] = part;
                            resume_index = index;
                        }
                    }
                    else{
                        j=1000//i should use a while loop :s
                    }
                }
                //iterate to catch all the katakana and punctuation
                resume_index =0;
                for(var k=1;k<100;k++){
                    if (casper.exists(x('//*[@id="secondary"]/div/ul/li['+i+']'+'/div[2]/ul/text()['+k+']'))) {
                        var part = casper.fetchText(x('//*[@id="secondary"]/div/ul/li['+i+']'+'/div[2]/ul/text()['+k+']'));
                        var index = sentence.indexOf(part, resume_index);
                        dictionary[index] = part;
                        resume_index = index;
                    }
                    else{
                        k=100
                    }
                }

                //build jpn sentences
                var keys = Object.keys(dictionary).sort(sortNumber);
                var arrayLength = keys.length;
                for (var l = 0; l < arrayLength; l++) {
                    jpn = jpn + dictionary[keys[l]]
                }
                eng = casper.getElementInfo(x('//*[@id="secondary"]/div/ul/li['+i+']'+'/div[2]/div/span[1]')).html
                // replace new lines with breaks, because anki
                jpn = jpn.replace(/(?:\r\n|\r|\n)/g, '<br />');
                eng = eng.replace(/(?:\r\n|\r|\n)/g, '<br />');
                // replace tabs with a space.
                var tab = RegExp("\\t", "g");
                jpn = jpn.replace(tab,'&nbsp;');
                eng = eng.replace(tab,'&nbsp;');
                //write to the csv
                fs.write('examples.txt', searchString + "\t" + jpn + "\t" + eng + "\n", 'a');
            }
            else{
                i=100 //100 is enough
            }
        }
        this.echo("thereismore")
        return
    }
    this.echo("0")
    return
});

casper.run();