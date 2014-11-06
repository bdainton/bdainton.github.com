$(document).ready(function() {
  // $('.container').fadeOut(3000);
  $('#search-form').submit(function() {
    var text = $('#q').val();
    var time = "-1d";
    var category = $('#category-select').val();
    if (category == "All Page Categories") {
      category = "";
    } else {
      category = "\"" + category + "\"";
    }
    getTopTerms(time, text, category);
    // getTimeSeries(time, text, category);
    getEntities(time, text, category);
    $('.summary').fadeIn(2000);
    return false;
  });

  function getTimeSeries(time, text, category) {
    // $('#results #timeseries').fadeOut(1000);
    var url = "http://sam.massrel.com/search/search.json?filter.start=" + time + "&filter.finish=0&network=facebook&view.timeseries=true&filter.text=" + text + "&filter.category=" + encodeURIComponent(category) + "&view.timeseries.resolution=15m";

    $.ajax({
      url: url,
      crossDomain: true,
      context: document.body
    }).done(function(data) {
      var results = data.views.timeseries.data;
      var total = data.views.timeseries.counts.total;
      var counts = $.map(results, function(val, i) {
        return [[parseInt(i), parseInt(val.counts.total)]];
      });
      counts.unshift(["Index", "Post Count"]);
      
      displayTimeSeries(total, counts);
      return;
    });
    return;
  }

  function displayTimeSeries(total, counts, category) {
    var $summary = $('#timeseries-summary');
    $summary.html('Found ' + total + ' posts over the last 24h.');

    var data = google.visualization.arrayToDataTable(counts);

    var options = {
      title: 'Posts over Time',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('timeseries-chart'));
    chart.draw(data, options);
  }

  function getEntities(time, text, category) {
    // clear old results
    $('#posts .fb-post').fadeOut(1000);

    $.ajax({
      url: "http://sam.massrel.com/search/search.json?filter.start=" + time + "&filter.finish=0&network=facebook&filter.text=" + text + "&filter.category=" + encodeURIComponent(category) + "&view.entities=true&view.entities.sort=activity&view.counts=true&view.entities.limit=20",
      crossDomain: true,
      context: document.body
    }).done(function(data) {
      var posts = data['views']['entities']['data'];
      displayPosts(posts);
      return;
    });
    return;
  }

  function displayPosts(posts) {
    var $posts = $('#posts');
    var $summary = $('#posts-summary');

    // add header
    $summary.html('Top Posts, ranked by engagement.');

    // add the posts
    $.each(posts, function(index, post) {
      $posts.append(embedCodeForPost(post));
    });

    window.fbAsyncInit();
  }

  function embedCodeForPost(post) {
    var splitEntityId = post.raw.entity_id.split('_');
    var pageId = splitEntityId[0];
    var postId = splitEntityId[1];
    // return '<div>' + postId + '</div>';
    return '<div class="fb-post" data-href="https://www.facebook.com/' + pageId + 
      '/posts/' + postId + '" data-width="350"></div>';
  }

  function getTopTerms(time, text, category) {
    // clear old results
    $('#terms .term').fadeOut(1000);

    $.ajax({
      url: "http://sam.massrel.com/search/search.json?filter.start=" + time + "&filter.finish=0&network=facebook&filter.text=" + text + "&filter.category=" + encodeURIComponent(category) + "&view.terms=true",
      crossDomain: true,
      context: document.body
    }).done(function(data) {
      var terms = data['views']['terms']['data'];
      displayTopTerms(terms);
      return;
    });
    return;
  }

  function displayTopTerms(terms) {
    var $terms = $('#terms');
    var $termsTop5 = $('#terms-top5');
    var $termsRest = $('#terms-rest');

    // add the posts
    $.each(terms, function(index, term) {
      if (index < 5) {
        $termsTop5.append(templateForTerm(term, index));
      } else {
        $termsRest.append(templateForTerm(term, index));
      }
      
    });
  }

  function templateForTerm(term, index) {
    return '<p class="term term-' + index + '">' + term.name + '</p>';
  }
});