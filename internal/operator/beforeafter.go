package operator

import (
	"errors"
	"time"
)

// Before operator will check if the date value from the user context is before
// any of the configured date values on the flag.
func Before(usrValue interface{}, validValues []interface{}) (bool, error) {
	for _, v := range validValues {
		ok, err := before(v, usrValue)
		if err != nil {
			return false, err
		}
		if ok {
			return true, nil
		}
	}
	return false, nil
}

// After operator will check if the date value from the user context is after
// any of the configured date values on the flag.
func After(usrValue interface{}, validValues []interface{}) (bool, error) {
	for _, v := range validValues {
		ok, err := before(v, usrValue)
		if err != nil {
			return false, err
		}
		if ok {
			return false, nil
		}
	}
	return true, nil
}

func before(cnstrnValue, userValue interface{}) (bool, error) {
	usrTime, err := toDate(userValue)
	if err != nil {
		return false, err
	}
	switch v := cnstrnValue.(type) {
	case string:
		cnstrnTime, err := toDate(v)
		if err != nil {
			return false, err
		}
		return usrTime.Before(cnstrnTime), nil
	default:
		return false, nil
	}
}

func toDate(str interface{}) (time.Time, error) {
	switch v := str.(type) {
	case string:
		return time.Parse(time.RFC3339, v)
	default:
		return time.Time{}, errors.New("invalid date type")
	}
}
