Noto Serif Devanagari SemiBold (600), version 2.006 — Hindi headlines on /telepathy-workshop
Copyright 2022 The Noto Project Authors (https://github.com/notofonts/devanagari)
Licensed under the SIL Open Font License, Version 1.1 (https://openfontlicense.org)

Subsets of the Google Fonts files, made with fontTools (pyftsubset), all
OpenType layout features kept so conjuncts and matras render correctly:

  pyftsubset <devanagari.woff2> --unicodes="U+0900-097F,U+20B9,U+200C-200D,U+25CC" \
    --layout-features='*' --flavor=woff2 --output-file=noto-serif-devanagari-600-devanagari.woff2
  pyftsubset <latin.woff2> --unicodes="U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,U+2122" \
    --layout-features='*' --flavor=woff2 --output-file=noto-serif-devanagari-600-latin.woff2

The @font-face rules are in src/app/telepathy-workshop/telepathy-workshop.css.
