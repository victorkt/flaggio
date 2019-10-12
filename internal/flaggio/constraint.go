package flaggio

import (
	"github.com/sirupsen/logrus"
	"github.com/victorkohl/flaggio/internal/operator"
)

type Operator interface {
	Operate(usrValue interface{}, validValues []interface{}) bool
}

type Constraint struct {
	ID        string
	Property  string
	Operation Operation
	Values    []interface{}
}

func (c Constraint) Validate(usrContext map[string]interface{}) bool {
	op, ok := operatorMap[c.Operation]
	if !ok {
		// unknown operation, this is a configuration problem
		logrus.WithField("operation", c.Operation).Error("unknown operation")
		return false
	}
	// TODO: check if worth to return errors
	switch c.Operation {
	case OperationIsInSegment, OperationIsntInSegment:
		return op.Operate(usrContext, c.Values)
	default:
		return op.Operate(usrContext[c.Property], c.Values)
	}
}

type ConstraintList []*Constraint

func (l ConstraintList) Validate(usrContext map[string]interface{}) bool {
	for _, c := range l {
		if c.Validate(usrContext) {
			return true
		}
	}
	return false
}

var operatorMap = map[Operation]Operator{
	OperationOneOf:    operator.OneOf{},
	OperationNotOneOf: operator.NotOneOf{},
	// OperationGreater:          operator.Greater{},
	// OperationGreaterOrEqual:   operator.GreaterOrEqual{},
	// OperationLower:            operator.Lower{},
	// OperationLowerOrEqual:     operator.LowerOrEqual{},
	OperationExists:      operator.Exists{},
	OperationDoesntExist: operator.DoesntExist{},
	// OperationContains:         operator.Contains{},
	// OperationDoesntContain:    operator.DoesntContain{},
	// OperationStartsWith:       operator.StartsWith{},
	// OperationDoesntStartWith:  operator.DoesntStartWith{},
	// OperationEndsWith:         operator.EndsWith{},
	// OperationDoesntEndWith:    operator.DoesntEndWith{},
	// OperationMatchesRegex:     operator.MatchesRegex{},
	// OperationDoesntMatchRegex: operator.DoesntMatchRegex{},
	// TODO: date operations
	OperationIsInSegment:   operator.Validates{},
	OperationIsntInSegment: operator.DoesntValidate{},
}