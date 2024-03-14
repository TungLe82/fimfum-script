// ==UserScript==
// @name         Crawler
// @namespace    http://tampermonkey.net/
// @version      20.01.2024
// @description  try to take over the world!
// @author       You
// @match        https://www.fragrantica.com/perfume/*
// ==/UserScript==

// Example data
// {
//   "fragrance": {
//       "name": "Antaeus Chanel",
//       "for": "men",
//       "image": "https://fimgs.net/mdimg/perfume/375x500.616.jpg",
//       "brand": "Chanel",
//       "brandImage": "https://fimgs.net/mdimg/dizajneri/m.30.jpg",
//       "avgRating": 4.25,
//       "votes": 5046,
//       "perfumer": "Jacques Polge",
//       "perfumerImage": "https://frgs.me/mdimg/nosevi/fit.134.jpg",
//       "fragranceUrl": "https://www.fragrantica.com/perfume/Chanel/Antaeus-616.html",
//       "description": "Antaeus is the name of ancient Greek demigod. Strong, like a god, and gentle as a man, Antaeus belongs to those perfumes of expressed individuality and strong character which emphasize masculinity, what was a trend in 1980-ies. Myrtle and sage, lime and thyme have united to give the fragrance a special freshness and masculine character. The fragrance is warming up and becomes intensive at the end due to patchouli, sandal and labdanum in the base. Sharp animalistic nuance is brought in by the notes of castoreum and leather. \n The top notes include lemon, lime, coriander, myrtle, clary sage, and bergamot. The heart is composed of thyme, basil, rose and jasmine, while the base of patchouli, castoreum, labdanum, and oak moss. The perfume was created by Jacques Polge in 1981."
//   },
//   "accords": [
//       {
//           "name": "aromatic",
//           "color": "rgb(0, 0, 0)",
//           "background": "rgb(55, 160, 137)",
//           "opacity": 1,
//           "percent": 100
//       },
//       {
//           "name": "woody",
//           "color": "rgb(255, 255, 255)",
//           "background": "rgb(119, 68, 20)",
//           "opacity": 0.980115,
//           "percent": 97.7563
//       }
//   ],
//   "comments": [
//       {
//           "comment": "Rich, nuanced, and unique scent",
//           "type": "pros"
//       },
//       {
//           "comment": "May not be suitable for younger wearers",
//           "type": "cons"
//       }
//   ],
//   "ratings": [
//       {
//           "name": "love",
//           "percent": 100,
//           "opacity": 1,
//           "background": "rgb(255, 118, 111)"
//       },
//       {
//           "name": "like",
//           "percent": 80,
//           "opacity": 0,
//           "background": "rgba(204, 224, 239, 0.4)"
//       }
//   ],
//   "seasons": [
//       {
//           "name": "winter",
//           "percent": 100,
//           "opacity": 1,
//           "background": "rgba(204, 224, 239, 0.4)"
//       },
//       {
//           "name": "spring",
//           "percent": 40,
//           "opacity": 0.8,
//           "background": "rgba(204, 224, 239, 0.4)"
//       }
//   ],
//   "notes": [
//       {
//           "name": "Myrhh",
//           "type": "Top Notes",
//           "image": "https://fimgs.net/mdimg/sastojci/t.98.jpg",
//           "url": "https://www.fragrantica.com/notes/Myrrh-98.html"
//       },
//       {
//           "name": "Clary Sage",
//           "type": "Top Notes",
//           "image": "https://fimgs.net/mdimg/sastojci/t.164.jpg",
//           "url": "https://www.fragrantica.com/notes/Clary-Sage-164.html"
//       }
//   ],
//   "longevities": [
//       {
//           "name": "very weak",
//           "value": 70
//       },
//       {
//           "name": "long lasting",
//           "value": 998
//       }
//   ]
// }

const BASE_URL = "https://f7be-14-248-94-10.ngrok-free.app";

$(document).ready(function () {
  try {
    setTimeout(() => {
      const URL = `${BASE_URL}/fragrance/create-all`;
      const onSuccess = (data) => {
        alert("Crawl thành công! Chuyển trang!");
      };

      const onError = (error) => {
        logError({ url: window.location.href, status: "error" });
      };

      const $top = $("#toptop");

      // get brand
      const brand = $top.next().find("p[itemprop='brand']").text().trim();
      const brandImage = $top
        .next()
        .find("p[itemprop='brand'] [itemprop='logo']")
        .attr("src");

      // get name, for and image
      const name = $($("div[itemprop='description'] p b")[0]).text().trim();
      let frgFor = "men";
      const forEls = $("h1[itemprop='name'] small").text().trim().split(" ");
      if (forEls.length > 2) {
        frgFor = "unisex";
      } else {
        frgFor = forEls[1];
      }
      const frgImage = $top.next().find("img[itemprop='image']").attr("src");

      // get avgRating and votes
      const avgRating = $(
        "div[itemprop='aggregateRating'] [itemprop='ratingValue']"
      ).text();
      const votes = $(
        "div[itemprop='aggregateRating'] [itemprop='ratingCount']"
      ).text();

      // get perfumer and perfumerImage
      const perfumerImage = $("img.perfumer-avatar").attr("src");
      const perfumer = $("img.perfumer-avatar").next().text().trim();

      // get description
      const description = $("div.fragrantica-blockquote").text().trim();

      const fragrance = {
        name,
        for: frgFor,
        image: frgImage,
        brand,
        brandImage,
        avgRating: avgRating ? parseFloat(avgRating) : 0,
        votes: votes ? parseInt(votes.replace(/,/g, "")) : 0,
        perfumer,
        perfumerImage,
        fragranceUrl: window.location.href,
        description,
      };

      // get accords
      const accords = [];
      const $accords = $(".cell.accord-box .accord-bar");
      $accords.each((i, el) => {
        const $el = $(el);
        const name = $el.text().trim();
        const percent = ($el.width() / $el.parent().width()) * 100;
        const color = $el.css("color");
        const background = $el.css("background-color");
        const opacity = $el.css("opacity");
        accords.push({
          name,
          percent: percent ? parseFloat(percent) : 0,
          color,
          background,
          opacity: opacity ? parseFloat(opacity) : 0,
        });
      });

      // get comments
      const comments = [];
      const $commentsPros = $("[alt='Pros']")
        .parent()
        .parent()
        .find(".cell.small-12>span");
      $commentsPros.each((i, el) => {
        const $el = $(el);
        const comment = $el.text().trim();
        const type = "Pros";
        comments.push({ comment, type });
      });

      const $commentsCons = $("[alt='Cons']")
        .parent()
        .parent()
        .find(".cell.small-12>span");
      $commentsCons.each((i, el) => {
        const $el = $(el);
        const comment = $el.text().trim();
        const type = "Cons";
        comments.push({ comment, type });
      });

      // get ratings
      const ratings = [];
      const ratingNames = ["love", "like", "ok", "dislike", "hate"];
      ratingNames.forEach((name) => {
        const $el = $("#toptop")
          .next()
          .find(`.vote-button-legend:contains("${name}")`)
          .parent()
          .next()
          .find(">div>div");
        const percent = ($el.width() / $el.parent().width()) * 100;
        const background = $el.css("background-color");
        const opacity = $el.css("opacity");
        ratings.push({
          name,
          percent: percent ? parseFloat(percent) : 0,
          opacity: opacity ? parseFloat(opacity) : 0,
          background,
        });
      });

      // get seasons
      const seasons = [];
      const seasonNames = [
        "winter",
        "spring",
        "summer",
        "fall",
        "day",
        "night",
      ];
      seasonNames.forEach((name) => {
        const $el = $("#toptop")
          .next()
          .find(`.vote-button-legend:contains("${name}")`)
          .parent()
          .next()
          .find(">div>div");
        const percent = ($el.width() / $el.parent().width()) * 100;
        const background = $el.css("background-color");
        const opacity = $el.css("opacity");
        seasons.push({
          name,
          percent: percent ? parseFloat(percent) : 0,
          opacity: opacity ? parseFloat(opacity) : 0,
          background,
        });
      });

      // get notes
      const notes = [];
      const noteTypes = ["Top Notes", "Middle Notes", "Base Notes"];
      noteTypes.forEach((type) => {
        const $notes = $(`#pyramid h4:contains("${type}")`)
          .next()
          .find(">div>div");
        $notes.each((i, el) => {
          const $el = $(el);
          const name = $el.text().trim();
          const image = $el.find("img").attr("src");
          const url = $el.find("a").attr("href");
          notes.push({ name, type, image, url });
        });
      });

      if (!notes.length) {
        const $notes = $(`#pyramid .notes-box`).next().find(">div>div");
        $notes.each((i, el) => {
          const $el = $(el);
          const name = $el.text().trim();
          const image = $el.find("img").attr("src");
          const url = $el.find("a").attr("href");
          notes.push({ name, type: "Base Notes", image, url });
        });
      }

      //get longevities
      const longevities = [];
      const longevityNames = [
        "very weak",
        "weak",
        "moderate",
        "long lasting",
        "eternal",
      ];
      longevityNames.forEach((name) => {
        const $el = $(`.vote-button-name:contains('${name}')`).filter(
          function () {
            return $(this).text() === name;
          }
        )[0];
        const value = $($el).parent().next().text().trim();
        longevities.push({ name, value: value ? parseFloat(value) : 0 });
      });

      //get sillage
      const sillages = [];
      const sillageNames = ["intimate", "moderate", "strong", "enormous"];
      sillageNames.forEach((name) => {
        let $el = $(`.vote-button-name:contains('${name}')`).filter(
          function () {
            return $(this).text() === name;
          }
        );
        $el = $el[$el.length - 1];
        const value = $($el).parent().next().text().trim();
        sillages.push({ name, value: value ? parseFloat(value) : 0 });
      });

      //data
      const data = {
        fragrance,
        accords,
        comments,
        ratings,
        seasons,
        notes,
        longevities,
        sillages,
      };

      console.log("🚀 ~ data:", data);

      $.ajax({
        type: "POST",
        url: URL,
        data: data,
        success: onSuccess,
        error: onError,
        dataType: "json",
      });
    }, 5000);
  } catch (error) {
    logError({ url: window.location.href, status: "error" });
  }
});

const logError = (error) => {
  const URL = `${BASE_URL}/loggers/create`;

  $.ajax({
    type: "POST",
    url: URL,
    data: error,
    success: () => {
      alert("Lỗi rồi!");
    },
    error: () => {
      alert("Lỗi rồi!");
    },
    dataType: "json",
  });
};
