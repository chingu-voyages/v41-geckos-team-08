CREATE TABLE public.trades
(
    uuid uuid NOT NULL,
    description character varying NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (uuid)
);

CREATE TABLE public.users
(
    uuid uuid NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    is_supplier boolean NOT NULL,
    is_active boolean NOT NULL,
    name character varying NOT NULL,
    phone character varying NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (uuid),
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE public.supplier_trade
(
    trades_uuid uuid NOT NULL,
    supplier_uuid uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (trades_uuid, supplier_uuid),
    CONSTRAINT "fk_supplierTrades_trades" FOREIGN KEY (trades_uuid)
        REFERENCES public.trades (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT "fk_supplierTrades_user" FOREIGN KEY (supplier_uuid)
        REFERENCES public.users (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
);

CREATE TABLE public.city
(
    uuid uuid NOT NULL,
    name character varying NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (uuid),
    CONSTRAINT uk_city_name UNIQUE (name)
);

CREATE TABLE public.supplier_city
(
    supplier_uuid uuid NOT NULL,
    city_uuid uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (supplier_uuid, city_uuid),
    CONSTRAINT "fk_supplierCity_user" FOREIGN KEY (supplier_uuid)
        REFERENCES public.users (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT "fk_supplierCity_city" FOREIGN KEY (city_uuid)
        REFERENCES public.city (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
);

CREATE TABLE public.job
(
    uuid uuid NOT NULL,
    trade_uuid uuid NOT NULL,
    customer_uuid uuid NOT NULL,
    supplier_uuid uuid,
    city_uuid uuid NOT NULL,
    description character varying NOT NULL,
    low_price double precision,
    high_price double precision,
    expiration_date date,
    is_taken boolean NOT NULL DEFAULT false,
    is_completed boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (uuid),
    CONSTRAINT fk_job_trade FOREIGN KEY (trade_uuid)
        REFERENCES public.trades (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT fk_job_customer FOREIGN KEY (customer_uuid)
        REFERENCES public.users (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT fk_job_supplier FOREIGN KEY (supplier_uuid)
        REFERENCES public.users (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT fk_job_city FOREIGN KEY (city_uuid)
        REFERENCES public.city (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
);

CREATE TABLE public.proposal
(
    supplier_uuid uuid NOT NULL,
    job_uuid uuid NOT NULL,
    price double precision NOT NULL,
    expiration_date date NOT NULL,
    is_accepted boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (supplier_uuid, job_uuid),
    CONSTRAINT fk_proposal_supplier FOREIGN KEY (supplier_uuid)
        REFERENCES public.users (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID,
    CONSTRAINT fk_proposal_job FOREIGN KEY (job_uuid)
        REFERENCES public.job (uuid) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
        NOT VALID
);

CREATE TABLE IF NOT EXISTS public.countries
(
    uuid uuid NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT countries_pkey PRIMARY KEY (uuid)
);

ALTER TABLE IF EXISTS public.city
    ADD COLUMN country_uuid uuid NOT NULL;
ALTER TABLE IF EXISTS public.city
    ADD CONSTRAINT fk_city_country FOREIGN KEY (country_uuid)
    REFERENCES public.countries (uuid) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT
    NOT VALID;