"""Central runtime environment and feature flag helpers for RBP."""

from __future__ import annotations

import os
from dataclasses import asdict, dataclass
from typing import Any

import frappe


VALID_ENVIRONMENTS = {"local", "development", "qa", "staging", "production"}
VALID_STRIPE_MODES = {"test", "live"}


@dataclass(frozen=True)
class RbpRuntimeSettings:
	environment: str
	enable_stripe: bool
	stripe_mode: str
	enable_email_notifications: bool
	email_sandbox_mode: bool
	enable_application_provisioning: bool
	enable_application_interest: bool
	enable_admin_applications: bool

	@property
	def qa_banner_enabled(self) -> bool:
		return self.environment != "production"

	@property
	def stripe_test_mode(self) -> bool:
		return self.enable_stripe and self.stripe_mode == "test"

	@property
	def email_delivery_mode(self) -> str:
		if not self.enable_email_notifications:
			return "disabled"
		if self.email_sandbox_mode:
			return "sandbox"
		return "enabled"


DEFAULT_SETTINGS = RbpRuntimeSettings(
	environment="local",
	enable_stripe=False,
	stripe_mode="test",
	enable_email_notifications=False,
	email_sandbox_mode=True,
	enable_application_provisioning=False,
	enable_application_interest=True,
	enable_admin_applications=True,
)


CONFIG_KEYS = {
	"environment": "RBP_ENVIRONMENT",
	"enable_stripe": "RBP_ENABLE_STRIPE",
	"stripe_mode": "RBP_STRIPE_MODE",
	"enable_email_notifications": "RBP_ENABLE_EMAIL_NOTIFICATIONS",
	"email_sandbox_mode": "RBP_EMAIL_SANDBOX_MODE",
	"enable_application_provisioning": "RBP_ENABLE_APPLICATION_PROVISIONING",
	"enable_application_interest": "RBP_ENABLE_APPLICATION_INTEREST",
	"enable_admin_applications": "RBP_ENABLE_ADMIN_APPLICATIONS",
}

TRUE_VALUES = {"1", "true", "yes", "on", "enabled"}
FALSE_VALUES = {"0", "false", "no", "off", "disabled"}


def _site_config_value(env_key: str) -> Any:
	conf = getattr(frappe, "conf", None)
	if conf is None:
		return None

	candidates = (
		env_key,
		env_key.lower(),
		env_key.removeprefix("RBP_").lower(),
	)
	for key in candidates:
		if hasattr(conf, "get"):
			value = conf.get(key)
		else:
			value = getattr(conf, key, None)
		if value is not None:
			return value
	return None


def _raw_config_value(env_key: str, default: Any) -> Any:
	if env_key in os.environ:
		return os.environ[env_key]

	site_value = _site_config_value(env_key)
	if site_value is not None:
		return site_value

	return default


def _coerce_bool(value: Any, default: bool) -> bool:
	if isinstance(value, bool):
		return value
	if isinstance(value, int):
		return bool(value)
	if value is None:
		return default

	normalized = str(value).strip().lower()
	if normalized in TRUE_VALUES:
		return True
	if normalized in FALSE_VALUES:
		return False
	return default


def _coerce_environment(value: Any) -> str:
	normalized = str(value or DEFAULT_SETTINGS.environment).strip().lower()
	if normalized == "prod":
		return "production"
	if normalized == "dev":
		return "development"
	if normalized in VALID_ENVIRONMENTS:
		return normalized
	return DEFAULT_SETTINGS.environment


def _coerce_stripe_mode(value: Any, enable_stripe: bool) -> str:
	normalized = str(value or DEFAULT_SETTINGS.stripe_mode).strip().lower()
	if normalized not in VALID_STRIPE_MODES:
		normalized = DEFAULT_SETTINGS.stripe_mode
	if not enable_stripe and normalized == "live":
		return "test"
	return normalized


def get_runtime_settings() -> RbpRuntimeSettings:
	"""Return normalized runtime settings from environment or site config."""

	enable_stripe = _coerce_bool(
		_raw_config_value(CONFIG_KEYS["enable_stripe"], DEFAULT_SETTINGS.enable_stripe),
		DEFAULT_SETTINGS.enable_stripe,
	)
	return RbpRuntimeSettings(
		environment=_coerce_environment(
			_raw_config_value(CONFIG_KEYS["environment"], DEFAULT_SETTINGS.environment)
		),
		enable_stripe=enable_stripe,
		stripe_mode=_coerce_stripe_mode(
			_raw_config_value(CONFIG_KEYS["stripe_mode"], DEFAULT_SETTINGS.stripe_mode),
			enable_stripe,
		),
		enable_email_notifications=_coerce_bool(
			_raw_config_value(
				CONFIG_KEYS["enable_email_notifications"],
				DEFAULT_SETTINGS.enable_email_notifications,
			),
			DEFAULT_SETTINGS.enable_email_notifications,
		),
		email_sandbox_mode=_coerce_bool(
			_raw_config_value(CONFIG_KEYS["email_sandbox_mode"], DEFAULT_SETTINGS.email_sandbox_mode),
			DEFAULT_SETTINGS.email_sandbox_mode,
		),
		enable_application_provisioning=_coerce_bool(
			_raw_config_value(
				CONFIG_KEYS["enable_application_provisioning"],
				DEFAULT_SETTINGS.enable_application_provisioning,
			),
			DEFAULT_SETTINGS.enable_application_provisioning,
		),
		enable_application_interest=_coerce_bool(
			_raw_config_value(
				CONFIG_KEYS["enable_application_interest"],
				DEFAULT_SETTINGS.enable_application_interest,
			),
			DEFAULT_SETTINGS.enable_application_interest,
		),
		enable_admin_applications=_coerce_bool(
			_raw_config_value(
				CONFIG_KEYS["enable_admin_applications"],
				DEFAULT_SETTINGS.enable_admin_applications,
			),
			DEFAULT_SETTINGS.enable_admin_applications,
		),
	)


def get_safe_public_runtime_config() -> dict[str, Any]:
	"""Return frontend-safe runtime metadata without secrets or raw config."""

	settings = get_runtime_settings()
	flags = asdict(settings)
	return {
		"environment": settings.environment,
		"qa_banner_enabled": settings.qa_banner_enabled,
		"stripe": {
			"enabled": settings.enable_stripe,
			"mode": settings.stripe_mode,
			"test_mode": settings.stripe_test_mode,
		},
		"email": {
			"notifications_enabled": settings.enable_email_notifications,
			"sandbox_mode": settings.email_sandbox_mode,
			"delivery_mode": settings.email_delivery_mode,
		},
		"features": {
			"application_provisioning": settings.enable_application_provisioning,
			"application_interest": settings.enable_application_interest,
			"admin_applications": settings.enable_admin_applications,
		},
		"flags": flags,
	}


def is_application_provisioning_enabled() -> bool:
	return get_runtime_settings().enable_application_provisioning


def is_application_interest_enabled() -> bool:
	return get_runtime_settings().enable_application_interest


def is_admin_applications_enabled() -> bool:
	return get_runtime_settings().enable_admin_applications


def is_stripe_enabled() -> bool:
	return get_runtime_settings().enable_stripe


def get_stripe_mode() -> str:
	return get_runtime_settings().stripe_mode


def is_email_notifications_enabled() -> bool:
	return get_runtime_settings().enable_email_notifications


def is_email_sandbox_mode() -> bool:
	return get_runtime_settings().email_sandbox_mode
