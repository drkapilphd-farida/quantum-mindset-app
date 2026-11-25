-- Brain Test → WhatsApp card: 4 result messages + token in the test link (25 Nov 2026)
insert into wa_settings(key, value) select 'bot_flow_backup_20261125b', value from wa_settings where key='bot_flow'
on conflict (key) do update set value = excluded.value;

update wa_settings set value = (
  with base as (select value::jsonb as v0 from wa_settings where key='bot_flow'),
  links as (
    select
      case when (v0#>>'{nodes,n2h,cta,url}') like '%c={bt}%' then v0
           else jsonb_set(v0, '{nodes,n2h,cta,url}', to_jsonb((v0#>>'{nodes,n2h,cta,url}') || '&c={bt}')) end as v1
    from base
  ),
  links2 as (
    select
      case when (v1#>>'{nodes,n2,cta,url}') like '%c={bt}%' then v1
           else jsonb_set(v1, '{nodes,n2,cta,url}', to_jsonb((v1#>>'{nodes,n2,cta,url}') || '&c={bt}')) end as v
    from links
  )
  select (jsonb_set(jsonb_set(jsonb_set(jsonb_set(v, '{nodes,btr_full_en}', jsonb_build_object('text', $q$🎉 {name}, here's your Brain Test report!

{summary}

Your biggest win today: *{best}*.
That was a few minutes and one technique for each skill. Daily practice is what makes it stick.

In the live *Sharp Brain workshop* (2 evenings, about 90 min each) I teach you the full method and give you a 30-day plan.

— Dr. Kapil Dev Sharma$q$::text, 'media', jsonb_build_object('type','image','url','{card}'), 'buttons', '[]'::jsonb, 'next', to_jsonb($q$n5x$q$::text), 'header', '', 'footer', '', 'cta', jsonb_build_object('text', $q$Book Seat · ₹499$q$::text, 'url', v#>>'{nodes,n30,cta,url}')), true), '{nodes,btr_full_hi}', jsonb_build_object('text', $q$🎉 {name} जी, आपका Brain Test report तैयार है!

{summary}

आज की सबसे बड़ी जीत: *{best}*।
यह सिर्फ़ कुछ मिनट और हर skill की एक technique से हुआ। रोज़ का अभ्यास इसे पक्का करता है।

Live *Sharp Brain workshop* (2 शाम, लगभग 90-90 मिनट) में मैं पूरा तरीका सिखाता हूँ और 30 दिन का plan देता हूँ।

— Dr. Kapil Dev Sharma$q$::text, 'media', jsonb_build_object('type','image','url','{card}'), 'buttons', '[]'::jsonb, 'next', to_jsonb($q$n5x$q$::text), 'header', '', 'footer', '', 'cta', jsonb_build_object('text', $q$Seat बुक करें · ₹499$q$::text, 'url', v#>>'{nodes,n30,cta,url}')), true), '{nodes,btr_half_en}', jsonb_build_object('text', $q${name}, you stopped half-way — no problem 🙂
Here's what your brain already showed:

{summary}

✅ Done: {done}
⏳ Left: *{left}*

The rest takes about 2 minutes, and the last part is where many people see their biggest jump. Tap below to finish 👇

— Dr. Kapil Dev Sharma$q$::text, 'media', jsonb_build_object('type','image','url','{card}'), 'buttons', '[]'::jsonb, 'next', null::jsonb, 'header', '', 'footer', '', 'cta', jsonb_build_object('text', $q$Finish my test$q$::text, 'url', $q$https://www.mindurmind.org.in/reading-memory-test?utm_source=whatsapp&utm_medium=bot&utm_campaign=sb_resume_en&c={bt}$q$::text)), true), '{nodes,btr_half_hi}', jsonb_build_object('text', $q${name} जी, test आधे में रुक गया — कोई बात नहीं 🙂
अब तक आपके दिमाग़ ने यह दिखाया:

{summary}

✅ हो गया: {done}
⏳ बाकी: *{left}*

बाकी हिस्सा लगभग 2 मिनट का है, और आख़िरी हिस्से में ही कई लोगों को सबसे बड़ा फ़र्क दिखता है। नीचे दबाकर पूरा कीजिए 👇

— Dr. Kapil Dev Sharma$q$::text, 'media', jsonb_build_object('type','image','url','{card}'), 'buttons', '[]'::jsonb, 'next', null::jsonb, 'header', '', 'footer', '', 'cta', jsonb_build_object('text', $q$बाकी test पूरा करें$q$::text, 'url', $q$https://www.mindurmind.org.in/reading-memory-test?utm_source=whatsapp&utm_medium=bot&utm_campaign=sb_resume_hi&c={bt}$q$::text)), true))::text from links2
) where key='bot_flow';

select length(value) as len,
  value::jsonb#>>'{nodes,n2,cta,url}' as n2_url,
  value::jsonb#>>'{nodes,btr_full_hi,cta,url}' as full_hi_url,
  (select length(value) from wa_settings where key='bot_flow_backup_20261125b') as backup_len
from wa_settings where key='bot_flow';
