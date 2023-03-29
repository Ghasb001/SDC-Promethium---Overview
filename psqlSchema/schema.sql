CREATE DATABASE products;

CREATE TABLE productlist (
  product_id INTEGER,
  name TEXT,
  slogan TEXT,
  description TEXT,
  category TEXT,
  default_price INTEGER,
  PRIMARY KEY (product_id)
);

CREATE TABLE related (
  id BIGINT,
  product_id INTEGER,
  related_product_id INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (product_id)
      REFERENCES productlist (product_id),
  FOREIGN KEY (related_product_id)
      REFERENCES productlist (product_id)
);

CREATE TABLE features (
  feature_id BIGINT,
  product_id INTEGER,
  feature TEXT,
  value TEXT,
  PRIMARY KEY (feature_id),
  FOREIGN KEY (product_id)
      REFERENCES productlist (product_id)
);

CREATE TABLE styles (
  style_id INTEGER,
  product_id INTEGER,
  name TEXT,
  sale_price TEXT,
  original_price INTEGER,
  default_style BOOLEAN,
  PRIMARY KEY (style_id),
  FOREIGN KEY (product_id)
      REFERENCES productlist (product_id)
);

CREATE TABLE skus (
  sku_id BIGINT,
  style_id INTEGER,
  size TEXT,
  quantity INTEGER,
  PRIMARY KEY (sku_id),
  FOREIGN KEY (style_id)
      REFERENCES styles (style_id)
);

CREATE TABLE photos (
  photo_id INTEGER,
  style_id INTEGER,
  url TEXT,
  thumbnail_url TEXT,
  PRIMARY KEY (photo_id),
  FOREIGN KEY (style_id)
      REFERENCES styles (style_id)
);

CREATE INDEX related_index ON related (product_id);
CREATE INDEX feature_index ON features (product_id);
CREATE INDEX style_index ON styles (product_id);
CREATE INDEX photo_index ON photos (style_id);
CREATE INDEX sku_index ON skus (style_id);