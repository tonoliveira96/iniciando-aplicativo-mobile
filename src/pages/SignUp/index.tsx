import React, { useRef, useCallback} from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidadtionErrors';

import Input from '../../components/Input';
import Button from '../../components/Button'

import logoImg from '../../assets/logo.png';

import {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText,
}
  from './styles';

interface SignUpFormData{
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleSingUp = useCallback(async (data: SignUpFormData) => {
    console.log(data);
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email(),
        password: Yup.string().min(6, 'Mínimo 6 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      // await api.post('/users', data);
      // history.push('/')

      Alert.alert(
        'Cadastro realizado com sucesso!',
        'Vocêjá pode realizar login na aplicação',
      );


    } catch (err) {
      if(err instanceof Yup.ValidationError){
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro ao fazer o logon',
      );
    }

  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flex:1}}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSingUp}>
              <Input
              autoCapitalize="words"
              name="name"
              icon="user"
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={()=>{
                emailInputRef.current.focus()
              }} />

              <Input
              ref={emailInputRef}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              name="email"
              icon="mail"
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={()=>{
                passwordInputRef.current.focus()
              }}
               />

              <Input
              ref={passwordInputRef}
              name="password"
              icon="lock"
              placeholder="Senha"
              secureTextEntry
              returnKeyType="send"
              textContentType="newPassword"
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
              />

            </Form>
            <Button onPress={() => {
                 formRef.current?.submitForm()}
                 }>Entrar</Button>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.goBack()} >
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  )
}

export default SignUp;
